package job

import (
	"net/http"
	"os"

	"voxeti/backend/schema"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Find a specified job by its ID
func GetJobById(jobId string, dbClient *mongo.Client) (schema.Job, schema.ErrorResponse) {
	job, response := FindJobById(jobId, dbClient);
	return job, response
}

// Find a specified job by either a producer or designer ID
func GetJobsByDesignerOrProducerId(designerId string, producerId string, dbClient *mongo.Client) ([]schema.Job, schema.ErrorResponse) {
	jobs, response := findJobsByDesignerOrProducerId(designerId, producerId, dbClient);
	return jobs, response
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
	
// 	pagination
// 	limitStr := c.QueryParam("limit")
// 	skipStr := c.QueryParam("skip")
// 	limit, _ := strconv.Atoi(limitStr)  
// 	skip, _ := strconv.Atoi(skipStr) 
	
// 	cursor, err := jobCollection.Find(c.Request().Context(), bson.M{"designer_id": designerID}, options.Find().SetLimit(int64(limit)).SetSkip(int64(skip)))


