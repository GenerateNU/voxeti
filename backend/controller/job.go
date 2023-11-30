package controller

import (
	"strconv"
	"voxeti/backend/schema"
	"voxeti/backend/schema/job"
	"voxeti/backend/utilities"

	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterJobHandlers(e *echo.Group, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/jobs")

	emailService := utilities.EmailService{}

	api.GET("/:id", func(c echo.Context) error {
		jobId := c.Param("id")
		retrievedJob, errorResponse := job.GetJobById(jobId, dbClient)
		if errorResponse != nil {
			return c.JSON(utilities.CreateErrorResponse(errorResponse.Code, errorResponse.Message))
		}

		return c.JSON(http.StatusOK, retrievedJob)
	})

	api.GET("", func(c echo.Context) error {
		limit := 10 // represents the number of results we want per page
		designerId := c.QueryParam("designer")
		producerId := c.QueryParam("producer")
		status := c.QueryParam("status")
		page_num, _ := strconv.Atoi(c.QueryParam("page")) // the current page the user is on
		skip := limit * page_num

		// Convert Ids to correct type:
		designerIdObj, _ := primitive.ObjectIDFromHex(designerId)
		producerIdObj, _ := primitive.ObjectIDFromHex(producerId)

		if page_num < 0 {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid page number"))
		}
		retrievedJobs, errorResponse := job.GetJobsByDesignerOrProducerId(designerIdObj, producerIdObj, status, int64(limit), int64(skip), dbClient)
		if errorResponse != nil {
			return c.JSON(utilities.CreateErrorResponse(errorResponse.Code, errorResponse.Message))
		}

		return c.JSON(http.StatusOK, retrievedJobs)
	})

	api.DELETE("/:id", func(c echo.Context) error {
		// get job ID
		jobIDStr := c.Param("id")

		retrievedJob, errorResponse := job.GetJobById(jobIDStr, dbClient)
		if errorResponse != nil {
			return c.JSON(utilities.CreateErrorResponse(errorResponse.Code, errorResponse.Message))
		}

		if retrievedJob.Status != "PENDING" {
			return c.JSON(utilities.CreateErrorResponse(400, "You cannot delete a job that is not pending!"))
		}

		errorResponse = job.DeleteJob(jobIDStr, dbClient)
		if errorResponse != nil {
			return c.JSON(utilities.CreateErrorResponse(errorResponse.Code, errorResponse.Message))
		}

		return c.NoContent(http.StatusOK)
	})

	api.POST("", func(c echo.Context) error {
		// create new Job with given data
		newJob := new(schema.Job)
		if err := c.Bind(newJob); err != nil {
			logger.Error(err.Error())
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid job data"))
		}

		jobCreated, errorResponse := job.CreateJob(*newJob, dbClient, &emailService)

		if errorResponse != nil {
			return c.JSON(utilities.CreateErrorResponse(errorResponse.Code, errorResponse.Message))
		}

		return c.JSON(http.StatusOK, jobCreated)
	})

	api.PUT("/:id", func(c echo.Context) error {
		// get job ID
		jobId := c.Param("id")
		job_body_param := new(schema.Job)
		if err := c.Bind(job_body_param); err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid job data"))
		}

		retrievedJob, errorResponse := job.UpdateJob(jobId, *job_body_param, dbClient, &emailService)

		if errorResponse != nil {
			return c.JSON(utilities.CreateErrorResponse(errorResponse.Code, errorResponse.Message))
		}

		return c.JSON(http.StatusOK, retrievedJob)
	})

	api.PATCH("/:id", func(c echo.Context) error {
		jobIdStr := c.Param("id")
		patchData := bson.M{}
		if err := c.Bind(&patchData); err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid patch data"))
		}

		patchedJob, errorResponse := job.PatchJob(jobIdStr, patchData, dbClient, &emailService)
		if errorResponse != nil {
			return c.JSON(utilities.CreateErrorResponse(errorResponse.Code, errorResponse.Message))
		}
		return c.JSON(http.StatusOK, patchedJob)
	})

	// get all recommended jobs given a user id
	api.GET("/recommendations/:id", func(c echo.Context) error {

		page := c.QueryParam("page")
		limit := c.QueryParam("limit")
		filter := c.QueryParam("filter")
		sort := c.QueryParam("sort")

		if page == "" || limit == "" {
			return c.JSON(utilities.CreateErrorResponse(400, "Missing page or limit"))
		}

		pageInt, pageErr := strconv.Atoi(page)
		limitInt, limitErr := strconv.Atoi(limit)

		if pageErr != nil || limitErr != nil || pageInt < 1 || limitInt < 0 {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid page or limit"))
		}

		id, err := primitive.ObjectIDFromHex(c.Param("id"))
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid id"))
		}

		recommendedJobs, errorResponse := job.GetRecommendedJobs(pageInt, limitInt, filter, sort, &id, dbClient)
		if errorResponse != nil {
			return c.JSON(utilities.CreateErrorResponse(errorResponse.Code, errorResponse.Message))
		}
		return c.JSON(http.StatusOK, recommendedJobs)
	})
}
