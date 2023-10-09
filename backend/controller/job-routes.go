package controller

import (
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
		designerId := c.QueryParam("designer")
		producerId := c.QueryParam("producer")
		retrievedJobs, errorResponse := job.GetJobsByDesignerOrProducerId(designerId, producerId, dbClient)
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