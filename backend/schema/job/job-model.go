package job

import (
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Find a specified job by its ID
func GetJobById(jobId string, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	return getJobByIdDb(jobId, dbClient);
}

// Find a specified job by either a producer or designer ID
func GetJobsByDesignerOrProducerId(designerId string, producerId string, limit int64, skip int64, dbClient *mongo.Client) ([]schema.Job, *schema.ErrorResponse) {
	return getJobsByDesignerOrProducerIdDb(designerId, producerId, limit, skip, dbClient);
}

// Delete a job
func DeleteJob (jobId string, dbClient *mongo.Client) *schema.ErrorResponse {
	return deleteJobDb(jobId, dbClient);
}

// Creates a job
func CreateJob(newJob schema.Job, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	return createJobDb(newJob, dbClient);
}

// Updates a job
func UpdateJob(jobId string, job schema.Job, dbClient *mongo.Client)  (schema.Job, *schema.ErrorResponse) {
	return updateJobDb(jobId, job, dbClient);
}

// Updates a specific field in a job
func PatchJob(jobId primitive.ObjectID, patchData bson.M, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	return patchJobDb(jobId, patchData, dbClient);
}