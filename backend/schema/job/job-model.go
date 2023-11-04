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
	return createJobDb(newJob, dbClient)
}

// Updates a job
func UpdateJob(jobId string, job schema.Job, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	// *an advantage of change stream is it's not necessary to have this extra database call
	previousJob, _ := getJobByIdDb(jobId, dbClient)
	updatedJob, updateErr := updateJobDb(jobId, job, dbClient)
	// if the job status was changed, send an email and add a notification to the user
	if updateErr == nil && previousJob.Status != updatedJob.Status {
		changeErr := handleJobStatusChange(&updatedJob, dbClient)
		if changeErr != nil {
			// * something to consider, if the email fails to send but the update is correct, should we still send the updatedJob
			return updatedJob, changeErr
		}
	}
	return updatedJob, updateErr
}

// Updates a specific field in a job
func PatchJob(jobId primitive.ObjectID, patchData bson.M, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	return patchJobDb(jobId, patchData, dbClient)
}

func handleJobStatusChange(updatedJob *schema.Job, dbClient *mongo.Client) *schema.ErrorResponse {
	// use user transactions to get user from the job id
	u, err := user.GetUserById(&updatedJob.DesignerId, dbClient)
	if err != nil {
		return &schema.ErrorResponse{Code: 500, Message: err.Message}
	}
	sendEmailError := utilities.SendEmail(u, updatedJob)
	if sendEmailError != nil {
		return &schema.ErrorResponse{Code: 500, Message: sendEmailError.Message}
	}

	// add job notification to user
	jobNotification := schema.JobNotification{
		JobId:  updatedJob.Id,
		Status: updatedJob.Status,
		// how should we handle the time zone?
		CreatedAt: time.Now(),
	}
	notificationError := user.AddJobNotification(&u.Id, &jobNotification, dbClient)

	if notificationError != nil {
		return &schema.ErrorResponse{Code: 500, Message: notificationError.Message}
	}

	return nil
}
