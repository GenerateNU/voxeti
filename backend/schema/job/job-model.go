package job

import (
	"fmt"
	"time"
	"voxeti/backend/schema"
	"voxeti/backend/schema/user"
	"voxeti/backend/utilities"

	"go.mongodb.org/mongo-driver/bson"
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
func CreateJob(newJob schema.Job, dbClient *mongo.Client, emailService *utilities.EmailService) (schema.Job, *schema.ErrorResponse) {
	job, err := createJobDb(newJob, dbClient)
	if err != nil {
		return job, err
	}

	email, emailErr := constructJobCreationEmail(&job, dbClient)
	if emailErr != nil {
		return job, emailErr
	}
	fmt.Println("in job-model: ", emailService)
	statusChangeErr := handleJobStatusChange(&job, email, dbClient, emailService)
	if statusChangeErr != nil {
		return job, statusChangeErr
	}

	return job, nil
}

// Updates a job
func UpdateJob(jobId string, job schema.Job, dbClient *mongo.Client, emailService *utilities.EmailService) (schema.Job, *schema.ErrorResponse) {
	// *an advantage of change stream is it's not necessary to have this extra database call
	previousJob, _ := getJobByIdDb(jobId, dbClient)
	updatedJob, updateErr := updateJobDb(jobId, job, dbClient)

	if updateErr == nil {
		handleJobUpdateErr := handleJobUpdated(&previousJob, &updatedJob, dbClient, emailService)
		return updatedJob, handleJobUpdateErr
	}
	return updatedJob, updateErr
}

// Updates a specific field in a job
func PatchJob(jobId string, patchData bson.M, dbClient *mongo.Client, emailService *utilities.EmailService) (schema.Job, *schema.ErrorResponse) {
	previousJob, _ := getJobByIdDb(jobId, dbClient)
	patchedJob, patchErr := patchJobDb(jobId, patchData, dbClient)

	if patchErr == nil {
		handleJobUpdateErr := handleJobUpdated(&previousJob, &patchedJob, dbClient, emailService)
		return patchedJob, handleJobUpdateErr
	}
	return patchedJob, patchErr
}

// something that accepts the email, something that accepts
// Given two jobs objects with the same ID, determine if the statuses are different
// If they are, send an email to the designer and update the designer's notifications
func handleJobUpdated(previousJob *schema.Job, changedJob *schema.Job, dbClient *mongo.Client, emailService *utilities.EmailService) *schema.ErrorResponse {
	if previousJob.Id != changedJob.Id {
		return &schema.ErrorResponse{Code: 500, Message: "Job Ids do not match"}
	}
	if previousJob.Status != changedJob.Status {
		email, emailErr := constructUpdateJobStatusEmail(changedJob, dbClient)
		if emailErr != nil {
			return emailErr
		}

		statusChangeErr := handleJobStatusChange(changedJob, email, dbClient, emailService)
		if statusChangeErr != nil {
			// * something to consider, if the email fails to send but the update is correct, should we still send the updatedJob
			return statusChangeErr
		}
	}
	return nil
}

// sends an email to the designer and adds a notification to the designer
func handleJobStatusChange(job *schema.Job, email *schema.Email, dbClient *mongo.Client, emailService *utilities.EmailService) *schema.ErrorResponse {
	designer, designerErr := user.GetUserById(&job.DesignerId, dbClient)
	if designerErr != nil {
		return designerErr
	}

	sendEmailErr := emailService.SendEmail(email)
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
