package job

import (
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
func GetJobsByDesignerOrProducerId(designerId string, producerId string, status string, limit int64, skip int64, dbClient *mongo.Client) ([]schema.Job, *schema.ErrorResponse) {
	return getJobsByDesignerOrProducerIdDb(designerId, producerId, status, limit, skip, dbClient)
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
