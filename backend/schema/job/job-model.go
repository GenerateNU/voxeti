package job

import (
	"slices"
	"strings"

	"voxeti/backend/schema"
	"voxeti/backend/schema/user"
	"voxeti/backend/utilities"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Find a specified job by its ID
func GetJobById(jobId string, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	return getJobByIdDb(jobId, dbClient)
}

// Find a specified job by either a producer or designer ID
func GetJobsByDesignerOrProducerId(designerId string, producerId string, limit int64, skip int64, dbClient *mongo.Client) ([]schema.Job, *schema.ErrorResponse) {
	return getJobsByDesignerOrProducerIdDb(designerId, producerId, limit, skip, dbClient)
}

// Delete a job
func DeleteJob(jobId string, dbClient *mongo.Client) *schema.ErrorResponse {
	return deleteJobDb(jobId, dbClient)
}

// Creates a job
func CreateJob(newJob schema.Job, dbClient *mongo.Client, emailService utilities.NotificationService) (schema.Job, *schema.ErrorResponse) {
	job, err := createJobDb(newJob, dbClient)
	if err != nil {
		return job, err
	}

	email, constructErr := constructJobCreationEmail(&job, dbClient)
	if constructErr != nil {
		return job, constructErr
	}

	emailErr := emailService.SendNotification(email)
	if emailErr != nil {
		return job, emailErr
	}

	return job, nil
}

// Updates a job
func UpdateJob(jobId string, job schema.Job, dbClient *mongo.Client, emailService utilities.NotificationService) (schema.Job, *schema.ErrorResponse) {
	// *an advantage of change stream is it's not necessary to have this extra database call
	previousJob, _ := getJobByIdDb(jobId, dbClient)
	updatedJob, updateErr := updateJobDb(jobId, job, dbClient)

	if updateErr != nil {
		return updatedJob, updateErr
	}

	if previousJob.Status != updatedJob.Status {
		email, constructErr := constructUpdateJobStatusEmail(&updatedJob, dbClient)
		if constructErr != nil {
			return updatedJob, constructErr
		}

		emailErr := emailService.SendNotification(email)
		if emailErr != nil {
			return job, emailErr
		}
	}

	return updatedJob, updateErr
}

// Updates a specific field in a job
func PatchJob(jobId string, patchData bson.M, dbClient *mongo.Client, emailService utilities.NotificationService) (schema.Job, *schema.ErrorResponse) {
	previousJob, _ := getJobByIdDb(jobId, dbClient)
	patchedJob, patchErr := patchJobDb(jobId, patchData, dbClient)

	if patchErr != nil {
		return patchedJob, patchErr
	}

	if previousJob.Status != patchedJob.Status {
		email, constructErr := constructUpdateJobStatusEmail(&patchedJob, dbClient)
		if constructErr != nil {
			return patchedJob, constructErr
		}

		emailErr := emailService.SendNotification(email)
		if emailErr != nil {
			return patchedJob, emailErr
		}
	}

	return patchedJob, patchErr
}

// get recommended jobs
func GetRecommendedJobs(page int, limit int, filter string, sort string, id *primitive.ObjectID, dbClient *mongo.Client) (*[]schema.Job, *schema.ErrorResponse) {

	filters, err := getRecommendationFilters(filter)
	if err != nil {
		return nil, err
	}

	sorter, err := getRecommendationSorter(sort)
	if err != nil {
		return nil, err
	}

	producer, err := user.GetUserById(id, dbClient)
	if err != nil {
		return nil, err
	}

	filteredJobs, err := filterJobs(producer, filters, dbClient)

	if err != nil {
		return nil, err
	}

	sortedJobs := sortJobs(filteredJobs, sorter)

	// paginate recommended jobs
	sortedJobs = paginateJobs(page, limit, sortedJobs)

	return sortedJobs, nil
}

// given a job, constructs an email for the job's designer that indicates the job's status has been updated
func constructUpdateJobStatusEmail(job *schema.Job, dbClient *mongo.Client) (*schema.Email, *schema.ErrorResponse) {
	designer, designerErr := user.GetUserById(&job.DesignerId, dbClient)
	if designerErr != nil {
		return nil, designerErr
	}

	return &schema.Email{
		Recipient: designer.Email,
		Name:      designer.FirstName + " " + designer.LastName,
		Subject:   "Job " + job.Id.Hex() + " Status Update",
		Body:      "Job " + job.Id.Hex() + " has been updated to status: " + string(job.Status),
	}, nil
}

// Given a created job, constructs an email to send to the designer that indicates the job has been created
func constructJobCreationEmail(job *schema.Job, dbClient *mongo.Client) (*schema.Email, *schema.ErrorResponse) {
	designer, designerErr := user.GetUserById(&job.DesignerId, dbClient)
	if designerErr != nil {
		return nil, designerErr
	}

	return &schema.Email{
		Recipient: designer.Email,
		Name:      designer.FirstName + " " + designer.LastName,
		Subject:   "Job " + job.Id.Hex() + " Created",
		Body:      "Job " + job.Id.Hex() + " has been created with status: " + string(job.Status),
	}, nil
}

// paginate jobs by page and limit
func paginateJobs(page int, limit int, jobs *[]schema.Job) *[]schema.Job {
	// get start and end indices for pagination
	start := (page - 1) * limit
	end := page * limit

	// if start is greater than length of jobs, return empty array
	if start > len(*jobs) {
		return &[]schema.Job{}
	}

	// if end is greater than length of jobs, set end to length of jobs
	if end > len(*jobs) {
		end = len(*jobs)
	}

	// return paginated jobs
	derefJobs := *jobs
	paginatedJobs := derefJobs[start:end]
	return &paginatedJobs
}

type RecommendationFilter string

const (
	Distance               = "DISTANCE"
	SupportedFilamentTypes = "SUPPORTEDFILAMENTTYPES"
	AvailableFilamentTypes = "AVAILABLEFILAMENTTYPES"
	AvailableColors        = "AVAILABLECOLORS"
)

func filterJobs(producer *schema.User, filters []RecommendationFilter, dbClient *mongo.Client) (*[]schema.Job, *schema.ErrorResponse) {
	availableFilamentTypes := user.GetAvailableFilamentTypes(producer)
	supportedFilamentTypes := user.GetSupportedFilamentTypes(producer)
	availableColors := user.GetAvailableColors(producer)
	var METERS_PER_MILE = 1609.34

	var bsonFilters []bson.M
	for _, filter := range filters {
		switch filter {
		case Distance:
			f := bson.M{
				"shippingAddress.location": bson.M{
					"$nearSphere": bson.M{
						"$geometry":    producer.Addresses[0].Location,
						"$maxDistance": 100 * METERS_PER_MILE,
					},
				},
			}
			bsonFilters = append(bsonFilters, f)
		case SupportedFilamentTypes:
			f := bson.M{
				"filament": bson.M{"$in": supportedFilamentTypes},
			}
			bsonFilters = append(bsonFilters, f)
		case AvailableFilamentTypes:
			f := bson.M{
				"filament": bson.M{"$in": availableFilamentTypes},
			}
			bsonFilters = append(bsonFilters, f)
		case AvailableColors:
			f := bson.M{
				"color": bson.M{"$in": availableColors},
			}
			bsonFilters = append(bsonFilters, f)
		}
	}

	if len(bsonFilters) == 0 {
		filteredJobs, err := getJobsByFilterDb(&bson.M{}, dbClient)
		if err != nil {
			return nil, err
		}
		return filteredJobs, nil
	}

	filteredJobs, err := getJobsByFilterDb(&bson.M{"$and": bsonFilters}, dbClient)
	if err != nil {
		return nil, err
	}

	return filteredJobs, nil
}

type RecommendationSorter string

const (
	Price = "PRICE"
)

func sortJobs(jobs *[]schema.Job, sorter RecommendationSorter) *[]schema.Job {
	switch sorter {
	case Price:
		s := func(job1 schema.Job, job2 schema.Job) int {
			return job1.Price - job2.Price
		}
		slices.SortFunc(*jobs, s)
		return jobs
	default:
		return jobs
	}
}

// extract filters from query param
func getRecommendationFilters(filter string) ([]RecommendationFilter, *schema.ErrorResponse) {
	var filters []RecommendationFilter
	if filter != "" {
		filterArray := strings.Split(filter, ",")
		for _, filter := range filterArray {
			switch filter {
			case "DISTANCE":
				filters = append(filters, Distance)
			case "SUPPORTEDFILAMENTTYPES":
				filters = append(filters, SupportedFilamentTypes)
			case "AVAILABLEFILAMENTTYPES":
				filters = append(filters, AvailableFilamentTypes)
			case "AVAILABLECOLORS":
				filters = append(filters, AvailableColors)
			default:
				return nil, &schema.ErrorResponse{Code: 400, Message: "Invalid filter"}
			}
		}
	}
	return filters, nil
}

// extract sorter from query param
func getRecommendationSorter(sort string) (RecommendationSorter, *schema.ErrorResponse) {
	switch sort {
	case "PRICE":
		return Price, nil
	default:
		return "", &schema.ErrorResponse{Code: 400, Message: "Invalid sort"}
	}
}
