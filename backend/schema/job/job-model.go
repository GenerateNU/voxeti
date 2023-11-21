package job

import (
	"slices"

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
func GetRecommendedJobs(page int, limit int, id *primitive.ObjectID, dbClient *mongo.Client) (*[]schema.Job, *schema.ErrorResponse) {

	producer, err := user.GetUserById(id, dbClient)
	if err != nil {
		return nil, err
	}

	filters := declareFilters(producer)
	filteredJobs, err := filterJobs(filters, dbClient)

	if err != nil {
		return nil, err
	}

	sorters := declareSorters()
	sortedJobs := sortJobs(filteredJobs, sorters, dbClient)

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

func declareFilters(producer *schema.User) *[]bson.M {

	availableFilamentTypes := user.GetAvailableFilamentTypes(producer)
	supportedFilamentTypes := user.GetSupportedFilamentTypes(producer)
	availableColors := user.GetAvailableColors(producer)
	var METERS_PER_MILE = 1609.34

	filter1 := bson.M{
		"$and": []bson.M{
			{
				"shippingAddress.location": bson.M{
					"$nearSphere": bson.M{
						"$geometry":    producer.Addresses[0].Location,
						"$maxDistance": 100 * METERS_PER_MILE,
					},
				},
			},
			{
				"filament": bson.M{"$in": supportedFilamentTypes},
			},
			{
				"filament": bson.M{"$in": availableFilamentTypes},
			},
			{
				"color": bson.M{"$in": availableColors},
			},
		},
	}

	filter2 := bson.M{
		"$and": []bson.M{
			{
				"shippingAddress.location": bson.M{
					"$nearSphere": bson.M{
						"$geometry":    producer.Addresses[0].Location,
						"$maxDistance": 100 * METERS_PER_MILE,
					},
				},
			},
			{
				"filament": bson.M{"$in": supportedFilamentTypes},
			},
			{
				"filament": bson.M{"$in": availableFilamentTypes},
			},
		},
		"$nor": []bson.M{
			{
				"color": bson.M{"$in": availableColors},
			},
		},
	}

	filter3 := bson.M{
		"$and": []bson.M{
			{
				"shippingAddress.location": bson.M{
					"$nearSphere": bson.M{
						"$geometry":    producer.Addresses[0].Location,
						"$maxDistance": 100 * METERS_PER_MILE,
					},
				},
			},
			{
				"filament": bson.M{"$in": supportedFilamentTypes},
			},
			{
				"color": bson.M{"$in": availableColors},
			},
		},
		"$nor": []bson.M{
			{
				"filament": bson.M{"$in": availableFilamentTypes},
			},
		},
	}

	filter4 := bson.M{
		"$and": []bson.M{
			{
				"shippingAddress.location": bson.M{
					"$nearSphere": bson.M{
						"$geometry":    producer.Addresses[0].Location,
						"$maxDistance": 100 * METERS_PER_MILE,
					},
				},
			},
			{
				"filament": bson.M{"$in": supportedFilamentTypes},
			},
		},
		"$nor": []bson.M{
			{
				"filament": bson.M{"$in": availableFilamentTypes},
			},
			{
				"color": bson.M{"$in": availableColors},
			},
		},
	}

	filter5 := bson.M{
		"$and": []bson.M{
			{
				"shippingAddress.location": bson.M{
					"$nearSphere": bson.M{
						"$geometry":    producer.Addresses[0].Location,
						"$maxDistance": 100 * METERS_PER_MILE,
					},
				},
			},
		},
		"$nor": []bson.M{
			{
				"filament": bson.M{"$in": supportedFilamentTypes},
			},
			{
				"filament": bson.M{"$in": availableFilamentTypes},
			},
			{
				"color": bson.M{"$in": availableColors},
			},
		},
	}

	return &[]bson.M{filter1, filter2, filter3, filter4, filter5}
}

func filterJobs(filters *[]bson.M, dbClient *mongo.Client) (*[]schema.Job, *schema.ErrorResponse) {
	// for each filter, call transactions and append to jobs
	var jobs []schema.Job
	for _, filter := range *filters {
		filteredJobs, err := getJobsByFilterDb(&filter, dbClient)
		if err != nil {
			return nil, err
		}
		jobs = append(jobs, *filteredJobs...)
	}

	return &jobs, nil
}

func declareSorters() *[]func(schema.Job, schema.Job) int {
	return nil
}

func sortJobs(jobs *[]schema.Job, sorters *[]func(schema.Job, schema.Job) int, dbClient *mongo.Client) *[]schema.Job {

	if sorters == nil {
		return jobs
	}

	for _, sorter := range *sorters {
		slices.SortFunc(*jobs, sorter)
	}

	return jobs
}
