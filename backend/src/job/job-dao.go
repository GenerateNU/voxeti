package job

import (
	"context"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// job-dao abstracts common functionality we wish to have

func findJobById(jobId string, dbClient *mongo.Client) (schema.Job, schema.ErrorResponse) {
	jobCollection := dbClient.Database("voxeti").Collection("job")
	filter := bson.D{{Key: "Color", Value: "blue"}}
	
	// Retrieve the specified job from the collection
	var job schema.Job

	// If the job is not found, throw an error
	if err := jobCollection.FindOne(context.Background(), filter).Decode(&job); err != nil {
		return schema.Job{}, schema.ErrorResponse{Code: 400, Message: "Job does not exist!"}
	}

	// Return the job
	return job, schema.ErrorResponse{}

}