package controller

import (
	"strconv"
	"voxeti/backend/schema"
	"voxeti/backend/src/job"

	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
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
		retrievedJobs, errorResponse := job.GetJobsByDesignerOrProducerId(designerId, producerId, int64(limit), int64(skip), dbClient, c.Request().Context())
		if errorResponse.Code != 0 {
			return c.JSON(http.StatusBadRequest, errorResponse)
		}

		return c.JSON(http.StatusOK, retrievedJobs)
	})

	api.DELETE("/:id", func(c echo.Context) error {
		return job.DeleteJob(c, dbClient)
	})

	api.POST("/", func(c echo.Context) error {
		return job.CreateJob(c, dbClient)
	})

	api.PUT("/:id", func(c echo.Context) error {
		return job.UpdateJob(c, dbClient)
	})
	
}