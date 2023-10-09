package job

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"voxeti/backend/schema"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Find a specified job by its ID
func GetJobById(jobId string, dbClient *mongo.Client) (schema.Job, schema.ErrorResponse) {
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

// Find a specified job by either a producer or designer ID
func GetJobsByDesignerOrProducerId(designerId string, producerId string, limit int64, skip int64, dbClient *mongo.Client, requestContext context.Context) ([]schema.Job, schema.ErrorResponse) {
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

	// pagination options
	paginationOptions := options.Find();
	paginationOptions.SetLimit(limit);
	paginationOptions.SetSkip(skip);

	// If jobs are not found, throw an error
	cursor, err := jobCollection.Find(requestContext, filter, paginationOptions)
	if err != nil {
		fmt.Println(err.Error())
		return []schema.Job{}, schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}
	defer cursor.Close(requestContext)

	// Iterate over the cursor and append each job to the slice
	for cursor.Next(requestContext) {
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
func DeleteJob (c echo.Context, dbClient *mongo.Client) error {
	// get job ID
	jobIDStr := c.Param("id")
	jobID, err := primitive.ObjectIDFromHex(jobIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, schema.ErrorResponse{Code: 400, Message: "Invalid job ID format"})
	}
	// load colelction
	godotenv.Load(".env");
	jobCollection := dbClient.Database(os.Getenv("DB_NAME")).Collection("job")
	// delete job and check that the job was deleted
	deleteResult, err := jobCollection.DeleteOne(c.Request().Context(), bson.M{"_id": jobID})
	if err != nil {
		return c.JSON(http.StatusBadRequest, schema.ErrorResponse{Code: 400, Message: "Error deleting job"})
	}
	if deleteResult.DeletedCount == 0 {
		return c.JSON(http.StatusNotFound, schema.ErrorResponse{Code: 404, Message: "Job does not exist!"})
	}

	return c.NoContent(http.StatusOK)
}

// Creates a job
func CreateJob(c echo.Context, dbClient *mongo.Client) error {
	// create new job with given data
	job := new(schema.Job)
	if err := c.Bind(job); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid job data"})
	}
	// insert the job into the database
	godotenv.Load(".env");
	jobCollection := dbClient.Database(os.Getenv("DB_NAME")).Collection("job")
	result, err := jobCollection.InsertOne(c.Request().Context(), job)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to create job"})
	}
	// add an ID field to the new job
	job.Id = result.InsertedID.(primitive.ObjectID)
	return c.JSON(http.StatusCreated, job)
}

// Updates a job
func UpdateJob(c echo.Context, dbClient *mongo.Client) error {
	// get job ID
	jobIDStr := c.Param("id")
	jobID, err := primitive.ObjectIDFromHex(jobIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, schema.ErrorResponse{Code: 400, Message: "Invalid job ID format"})
	}
	// create a new job with the given data
	godotenv.Load(".env");
	jobCollection := dbClient.Database(os.Getenv("DB_NAME")).Collection("job")
	job := new(schema.Job)
	if err := c.Bind(job); err != nil {
		return c.JSON(http.StatusBadRequest, schema.ErrorResponse{Code: 400, Message: "Invalid job data"})
	}
	// replace the old job with the new job
	_, err = jobCollection.ReplaceOne(c.Request().Context(), bson.M{"_id": jobID}, job)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, schema.ErrorResponse{Code: 500, Message: "Unable to update job"})
	}
	return c.JSON(http.StatusOK, job)
}