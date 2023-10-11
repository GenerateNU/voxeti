package controller

import (
	"strconv"
	"voxeti/backend/schema"
	"voxeti/backend/src/job"

	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterJobHandlers(e *echo.Group, store *sessions.CookieStore, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/jobs")

	api.GET("/:id", func(c echo.Context) error {
		jobId := c.Param("id")
		retrievedJob, errorResponse := job.GetJobById(jobId, dbClient)

		if errorResponse.Code != 0 {
			return c.JSON(http.StatusBadRequest, errorResponse)
		}

		return c.JSON(http.StatusOK, retrievedJob)
	})

	api.GET("/", func(c echo.Context) error {
		limit := 2 // represents the number of results we want per page
		designerId := c.QueryParam("designer")
		producerId := c.QueryParam("producer")
		page_num, _ := strconv.Atoi(c.QueryParam("page")) // the current page the user is on
		skip := limit * page_num
		
		if page_num < 0 {
			return c.JSON(http.StatusBadRequest, schema.ErrorResponse{Code: 400, Message: "Invalid page number"})
		}
		retrievedJobs, errorResponse := job.GetJobsByDesignerOrProducerId(designerId, producerId, int64(limit), int64(skip), dbClient)
		if errorResponse.Code != 0 {
			return c.JSON(http.StatusBadRequest, errorResponse)
		}

		return c.JSON(http.StatusOK, retrievedJobs)
	})

	api.DELETE("/:id", func(c echo.Context) error {
		// get job ID
		jobIDStr := c.Param("id")
		errorResponse := job.DeleteJob(jobIDStr, dbClient)
		if errorResponse.Code != 0 {
			return c.JSON(errorResponse.Code, errorResponse)
		}

		return c.NoContent(http.StatusOK)
	})

	api.POST("/", func(c echo.Context) error {
		// create new Job with given data
		newJob := new(schema.Job)
		if err := c.Bind(newJob); err != nil {
			return c.JSON(http.StatusBadRequest, schema.ErrorResponse{Code: 400, Message: "Invalid job data"})
		}
		jobCreated, errorResponse := job.CreateJob(*newJob, dbClient)

		if errorResponse.Code != 0 {
			return c.JSON(errorResponse.Code, errorResponse)
		}

		return c.JSON(http.StatusOK, jobCreated)
	})

	api.PUT("/:id", func(c echo.Context) error {
		// get job ID
		jobId := c.Param("id")
		job_body_param := new(schema.Job)
		if err := c.Bind(job_body_param); err != nil {
			return c.JSON(http.StatusBadRequest, schema.ErrorResponse{Code: 400, Message: "Invalid job data"})
		}
		retrievedJob, errorResponse := job.UpdateJob(jobId, *job_body_param, dbClient)

		if errorResponse.Code != 0 {
			return c.JSON(errorResponse.Code, errorResponse)
		}

		return c.JSON(http.StatusOK, retrievedJob)
	})

	api.PATCH("/:id", func(c echo.Context) error {
		jobIdStr := c.Param("id")
		jobId, err := primitive.ObjectIDFromHex(jobIdStr)
		if err != nil {
			return c.JSON(http.StatusBadRequest, schema.ErrorResponse{Code: 400, Message: "Invalid job ID format"})
		}
		patchData := bson.M{}
		if err := c.Bind(&patchData); err != nil {
			return c.JSON(http.StatusBadRequest, schema.ErrorResponse{Code: 400, Message: "Invalid udate data"})
		}
		patchedJob, errorResponse := job.PatchJob(jobId, patchData, dbClient)
		if errorResponse.Code != 0 {
			return c.JSON(http.StatusBadRequest, errorResponse)
		}
		return c.JSON(http.StatusOK, patchedJob)
	})
	
}