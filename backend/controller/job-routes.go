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
		job, _ := job.GetJobById(jobId, dbClient)

		// if response.Code != 0 {
		// 	return c.JSON(http.StatusBadRequest, response)
		// }

		return c.JSON(http.StatusOK, job)
	})

	// api.DELETE("/:id", func(c echo.Context) error {
	// 	return job.DeleteJob(c, dbClient)
	// })

	// api.POST("/", func(c echo.Context) error {
	// 	return job.CreateJob(c, dbClient)
	// })

	// api.PUT("/:id", func(c echo.Context) error {
	// 	return job.UpdateJob(c, dbClient)
	// })
	
}