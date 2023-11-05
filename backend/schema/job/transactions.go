package job

import (
	"context"

	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Find a specified job by its ID
func getJobByIdDb(jobId string, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	objectId, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Invalid JobId"}
	}
	filter := bson.M{"_id": objectId}

	// Retrieve the specified job from the collection
	var job schema.Job

	// If the job is not found, throw an error
	if err := jobCollection.FindOne(context.Background(), filter).Decode(&job); err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}

	// Return the job
	return job, nil
}

// Find a specified job by either a producer or designer ID
func getJobsByDesignerOrProducerIdDb(designerId string, producerId string, limit int64, skip int64, dbClient *mongo.Client) ([]schema.Job, *schema.ErrorResponse) {
	// load jobs collection
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	// Extract Object IDs
	designerObjId, _ := primitive.ObjectIDFromHex(designerId)
	producerObjId, _ := primitive.ObjectIDFromHex(producerId)

	// Create filter
	var filter primitive.D
	if designerId != "" && producerId != "" {
		filter = bson.D{{Key: "designerId", Value: designerObjId}, {Key: "producerId", Value: producerObjId}}
	} else if designerId != "" && producerId == "" {
		filter = bson.D{{Key: "designerId", Value: designerObjId}}
	} else if designerId == "" && producerId != "" {
		filter = bson.D{{Key: "producerId", Value: producerObjId}}
	}

	var jobs []schema.Job

	// pagination options
	paginationOptions := options.Find()
	paginationOptions.SetLimit(limit)
	paginationOptions.SetSkip(skip)

	// If jobs are not found, throw an error
	cursor, err := jobCollection.Find(context.Background(), filter, paginationOptions)
	if err != nil {
		return []schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}
	defer cursor.Close(context.Background())

	// Iterate over the cursor and append each job to the slice
	for cursor.Next(context.Background()) {
		var job schema.Job
		if err := cursor.Decode(&job); err != nil {
			return []schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Error decoding job!"}
		}
		jobs = append(jobs, job)
	}

	// If there was an error iterating over the cursor, return an error
	if err := cursor.Err(); err != nil {
		return []schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Error iterating over jobs!"}
	}
	// If no jobs exist (ex: there are 2 pages but user tries to go to "page 3")
	if jobs == nil {
		return []schema.Job{}, &schema.ErrorResponse{Code: 400, Message: "Page does not exist"}
	}

	// Return the jobs
	return jobs, nil
}

// Delete a job
func deleteJobDb(jobId string, dbClient *mongo.Client) *schema.ErrorResponse {
	jobIdObject, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return &schema.ErrorResponse{Code: 404, Message: "Invalid JobId"}
	}
	// load collection
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	// delete job and check that the job was deleted
	deleteResult, err := jobCollection.DeleteOne(context.Background(), bson.M{"_id": jobIdObject})
	if err != nil {
		return &schema.ErrorResponse{Code: 400, Message: "Error deleting job"}
	}
	if deleteResult.DeletedCount == 0 {
		return &schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}

	return nil
}

// Creates a job
func createJobDb(newJob schema.Job, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	// insert the job into the database
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	result, err := jobCollection.InsertOne(context.Background(), newJob)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Unable to create job"}
	}
	// add an ID field to the new job
	newJob.Id = result.InsertedID.(primitive.ObjectID)
	return newJob, nil
}

// Updates a job
func updateJobDb(jobId string, job schema.Job, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	jobIdObject, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}
	job.Id = jobIdObject
	// create a new job with the given data
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	// replace the old job with the new job
	_, err = jobCollection.ReplaceOne(context.Background(), bson.M{"_id": jobIdObject}, job)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Job update failed"}
	}
	return job, nil
}

// Updates a specific field in a job
func patchJobDb(jobIdStr string, patchData bson.M, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	// Convert jobId string to ObjectId
	jobId, parseError := primitive.ObjectIDFromHex(jobIdStr)
	if parseError != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Invalid JobID"}
	}
	// Update Job in Database
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	_, err := jobCollection.UpdateOne(context.Background(), bson.M{"_id": jobId}, bson.M{"$set": patchData})
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Unable to update job"}
	}
	updatedJob := schema.Job{}
	// Confirm job exists
	err = jobCollection.FindOne(context.Background(), bson.M{"_id": jobId}).Decode(&updatedJob)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Unable to retrieve updated job"}
	}
	return updatedJob, nil
}
