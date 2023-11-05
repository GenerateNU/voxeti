package job

import (
	"time"
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
func CreateJob(newJob schema.Job, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	job, err := createJobDb(newJob, dbClient)
	if err != nil {
		return job, err
	}

	email, emailErr := createJobEmail(&job, dbClient)
	if emailErr != nil {
		return job, emailErr
	}

	statusChangeErr := handleJobStatusChange(&job, email, dbClient)
	if statusChangeErr != nil {
		return job, statusChangeErr
	}

	return job, nil
}

// Updates a job
func UpdateJob(jobId string, job schema.Job, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	// *an advantage of change stream is it's not necessary to have this extra database call
	previousJob, _ := getJobByIdDb(jobId, dbClient)
	updatedJob, updateErr := updateJobDb(jobId, job, dbClient)

	if updateErr == nil && previousJob.Status != updatedJob.Status {
		email, emailErr := updateJobStatusEmail(&updatedJob, dbClient)
		if emailErr != nil {
			return updatedJob, emailErr
		}

		statusChangeErr := handleJobStatusChange(&updatedJob, email, dbClient)
		if statusChangeErr != nil {
			// * something to consider, if the email fails to send but the update is correct, should we still send the updatedJob
			return updatedJob, statusChangeErr
		}
	}
	return updatedJob, updateErr
}

// Updates a specific field in a job
func PatchJob(jobId primitive.ObjectID, patchData bson.M, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	return patchJobDb(jobId, patchData, dbClient)
}

// sends an email to the designer and adds a notification to the designer
func handleJobStatusChange(job *schema.Job, email *schema.Email, dbClient *mongo.Client) *schema.ErrorResponse {
	designer, designerErr := user.GetUserById(&job.DesignerId, dbClient)
	if designerErr != nil {
		return designerErr
	}

	sendEmailErr := utilities.SendEmail(email)
	if sendEmailErr != nil {
		return sendEmailErr
	}

	jobNotification := schema.JobNotification{
		JobId:  job.Id,
		Status: job.Status,
		// how should we handle time zone?
		CreatedAt: time.Now(),
	}
	notificationError := user.AddJobNotification(&designer.Id, &jobNotification, dbClient)

	if notificationError != nil {
		return notificationError
	}

	return nil
}

func updateJobStatusEmail(job *schema.Job, dbClient *mongo.Client) (*schema.Email, *schema.ErrorResponse) {
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

func createJobEmail(job *schema.Job, dbClient *mongo.Client) (*schema.Email, *schema.ErrorResponse) {
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
