package job

import (
	"context"
	"fmt"
	"os"

	"voxeti/backend/schema"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Find a specified job by its ID
func GetJobById(jobId string, dbClient *mongo.Client) (schema.Job, schema.ErrorResponse) {
	_ = godotenv.Load();
	jobCollection := dbClient.Database(os.Getenv("DB_NAME")).Collection("job")
	objectId, _ := primitive.ObjectIDFromHex(jobId);
	filter := bson.M{"_id": objectId}

	// Retrieve the specified job from the collection
	var job schema.Job

	// If the job is not found, throw an error
	if err := jobCollection.FindOne(context.Background(), filter).Decode(&job); err != nil {
		return schema.Job{}, schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}

	// Return the job
	return job, schema.ErrorResponse{}
}

// Find a specified job by either a producer or designer ID
func GetJobsByDesignerOrProducerId(designerId string, producerId string, limit int64, skip int64, dbClient *mongo.Client) ([]schema.Job, schema.ErrorResponse) {
	// load jobs collection
	_ = godotenv.Load();
	jobCollection := dbClient.Database(os.Getenv("DB_NAME")).Collection("job")
	// Extract Object IDs
	designerObjId, _ := primitive.ObjectIDFromHex(designerId)
	producerObjId, _ := primitive.ObjectIDFromHex(producerId)
	
	// Create filter
	var filter primitive.D = bson.D{{}};
	if (designerId != "" && producerId != "")  {
		filter = bson.D{{Key: "DesignerId", Value: designerObjId}, {Key: "ProducerId", Value: producerObjId}}
	} else if (designerId != "" && producerId == "") {
		filter = bson.D{{Key: "DesignerId", Value: designerObjId}}
	} else if (designerId == "" && producerId != "") {
		filter = bson.D{{Key: "ProducerId", Value: producerObjId}}
	}
	
	var jobs []schema.Job

	// pagination options
	paginationOptions := options.Find();
	paginationOptions.SetLimit(limit);
	paginationOptions.SetSkip(skip);

	// If jobs are not found, throw an error
	cursor, err := jobCollection.Find(context.Background(), filter, paginationOptions)
	if err != nil {
		fmt.Println(err.Error())
		return []schema.Job{}, schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}
	defer cursor.Close(context.Background())

	// Iterate over the cursor and append each job to the slice
	for cursor.Next(context.Background()) {
		var job schema.Job
		if err := cursor.Decode(&job); err != nil {
			return []schema.Job{}, schema.ErrorResponse{Code: 500, Message: "Error decoding job!"}
		}
		jobs = append(jobs, job)
	}

	// If there was an error iterating over the cursor, return an error
	if err := cursor.Err(); err != nil {
		return []schema.Job{}, schema.ErrorResponse{Code: 500, Message: "Error iterating over jobs!"}
	}
	// If no jobs exist (ex: there are 2 pages but user tries to go to "page 3")
	if jobs == nil {
		return []schema.Job{}, schema.ErrorResponse{Code: 400, Message: "Page does not exist"}
	}

	// Return the jobs
	return jobs, schema.ErrorResponse{}
}


// Delete a job
func DeleteJob (jobId string, dbClient *mongo.Client) schema.ErrorResponse {
	jobIdObject, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return schema.ErrorResponse{Code: 404, Message: "Invalid JobId"}
	}
	// load collectio
	_ = godotenv.Load(".env");
	jobCollection := dbClient.Database(os.Getenv("DB_NAME")).Collection("job")
	// delete job and check that the job was deleted
	deleteResult, err := jobCollection.DeleteOne(context.Background(), bson.M{"_id": jobIdObject})
	if err != nil {
		return schema.ErrorResponse{Code: 400, Message: "Error deleting job"}
	}
	if deleteResult.DeletedCount == 0 {
		return schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}

	return schema.ErrorResponse{}
}

// Creates a job
func CreateJob(newJob schema.Job, dbClient *mongo.Client) (schema.Job, schema.ErrorResponse) {
	// insert the job into the database
	_ = godotenv.Load(".env");
	jobCollection := dbClient.Database(os.Getenv("DB_NAME")).Collection("job")
	result, err := jobCollection.InsertOne(context.Background(), newJob)
	if err != nil {
		return schema.Job{}, schema.ErrorResponse{Code: 500, Message: "Unable to create job"}
	}
	// add an ID field to the new job
	newJob.Id = result.InsertedID.(primitive.ObjectID)
	return newJob, schema.ErrorResponse{}
}

// Updates a job
func UpdateJob(jobId string, job schema.Job, dbClient *mongo.Client)  (schema.Job, schema.ErrorResponse) {
	jobIdObject, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return schema.Job{}, schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}
	// create a new job with the given data
	_ = godotenv.Load(".env");
	jobCollection := dbClient.Database(os.Getenv("DB_NAME")).Collection("job")
	// replace the old job with the new job
	_, err = jobCollection.ReplaceOne(context.Background(), bson.M{"_id": jobIdObject}, job)
	if err != nil {
		return schema.Job{}, schema.ErrorResponse{Code: 500, Message: "Job update failed"}
	}
	return job, schema.ErrorResponse{}
}

func PatchJob(jobId primitive.ObjectID, patchData bson.M, dbClient *mongo.Client) (schema.Job, schema.ErrorResponse) {
	jobCollection := dbClient.Database(os.Getenv("DB_NAME")).Collection("job")
	_, err := jobCollection.UpdateOne(context.Background(), bson.M{"_id": jobId}, bson.M{"$set": patchData})
	if err != nil {
		return schema.Job{}, schema.ErrorResponse{Code: 500, Message: "Unable to update job"}
	}
	updatedJob := schema.Job{}
	err = jobCollection.FindOne(context.Background(), bson.M{"_id": jobId}).Decode(&updatedJob)
	if err != nil {
		return schema.Job{}, schema.ErrorResponse{Code: 404, Message: "Unable to retrieve updated job"}
	}
	return updatedJob, schema.ErrorResponse{}
}