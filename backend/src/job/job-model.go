package job

import (
	"net/http"
	"os"

	"voxeti/backend/schema"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Find a specified job by its ID
func GetJobById(jobId string, dbClient *mongo.Client) (schema.Job, schema.ErrorResponse) {
	// query the data access object for jobs
	/** 
		the data access object (DAO) is used to seperate model logic from the database, reduce coupling, and allow for easier testing
		if we wish to switch databases, we simply make a new dao (although, passing the dbClient still creates coupling)
	*/  
	job, response := findJobById(jobId, dbClient)
	return job, response
}



func DeleteJob (c echo.Context, dbClient *mongo.Client) error {
	// get job ID
	jobIDStr := c.Param("id")
	jobID, err := primitive.ObjectIDFromHex(jobIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid job ID format"})
	}
	jobCollection := dbClient.Database(os.Getenv("voxeti")).Collection("job")
	// delete job and check that the job was deleted
	deleteResult, err := jobCollection.DeleteOne(c.Request().Context(), bson.M{"_id": jobID})
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Error Deleting Job"})
	}
	if deleteResult.DeletedCount == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Job Not Found"})
	}

	return c.NoContent(http.StatusOK)
}

func CreateJob(c echo.Context, dbClient *mongo.Client) error {
	// create new job with given data
	job := new(schema.Job)
	if err := c.Bind(job); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid job data"})
	}
	// insert the job into the database
	jobCollection := dbClient.Database(os.Getenv("voxeti")).Collection("job")
	result, err := jobCollection.InsertOne(c.Request().Context(), job)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to create job"})
	}
	// add an ID field to the new job
	job.Id = result.InsertedID.(primitive.ObjectID)
	return c.JSON(http.StatusCreated, job)
}

func UpdateJob(c echo.Context, dbClient *mongo.Client) error {
	// get job ID
	jobIDStr := c.Param("id")
	jobID, err := primitive.ObjectIDFromHex(jobIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid job ID format"})
	}
	// create a new job with the given data
	jobCollection := dbClient.Database(os.Getenv("voxeti")).Collection("job")
	job := new(schema.Job)
	if err := c.Bind(job); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid job data"})
	}
	// replace the old job with the new job
	_, err = jobCollection.ReplaceOne(c.Request().Context(), bson.M{"_id": jobID}, job)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to update job"})
	}
	return c.JSON(http.StatusOK, job)
}

// func GetJobsForDesigner(c echo.Context, dbClient *mongo.Client) error {
// 	// get the designer id if there is one
// 	designerIDStr := c.QueryParam("designer")
// 	designerID, err := primitive.ObjectIDFromHex(designerIDStr)
// 	if err != nil {
// 		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid designer ID format"})
// 	}
	
// 	// pagination
// 	limitStr := c.QueryParam("limit")
// 	skipStr := c.QueryParam("skip")
// 	limit, _ := strconv.Atoi(limitStr)  
// 	skip, _ := strconv.Atoi(skipStr) 
	
// 	jobCollection := dbClient.Database(os.Getenv("voxeti")).Collection("jobs")
// 	cursor, err := jobCollection.Find(c.Request().Context(), bson.M{"designer_id": designerID}, options.Find().SetLimit(int64(limit)).SetSkip(int64(skip)))
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to fetch jobs"})
// 	}
// 	defer cursor.Close(c.Request().Context())

// 	// get the jobs for the designer
// 	jobs := []schema.Job{}
// 	if err := cursor.All(c.Request().Context(), &jobs); err != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to parse fetched jobs"})
// 	}

// 	return c.JSON(http.StatusOK, jobs)
// }
