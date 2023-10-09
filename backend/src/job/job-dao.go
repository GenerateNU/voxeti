package job

import (
	"context"
	"os"
	"voxeti/backend/schema"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// job-dao abstracts common functionality we wish to have

func FindJobById(jobId string, dbClient *mongo.Client) (schema.Job, schema.ErrorResponse) {
	godotenv.Load()	
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

func findJobsByDesignerOrProducerId(designerId string, producerId string, dbClient *mongo.Client) ([]schema.Job, schema.ErrorResponse) {
	// load jobs collection
	godotenv.Load()	
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

	// If jobs are not found, throw an error
	cursor, err := jobCollection.Find(context.Background(), filter)
	if err != nil {
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

	// Return the jobs
	return jobs, schema.ErrorResponse{}
}