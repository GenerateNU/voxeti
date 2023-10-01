package controller

import (
	"net/http"
	"voxeti/backend/model"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterHandlers(e *echo.Echo, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/api")

	// Register Additional Handlers:
	RegisterFilesHandlers(api, logger);

	// catch any invalid endpoints with a 404 error
	api.GET("*", func(c echo.Context) error {
		return c.String(http.StatusNotFound, "Not Found")
	})

	// useful endpoint for ensuring server is running
	api.GET("/healthcheck", func(c echo.Context) error {
		logger.Info("healthcheck endpoint hit!")
		return c.NoContent(http.StatusOK)
	})

	// EXAMPLE ENDPOINT
	api.GET("/helloworld", func(c echo.Context) error {
		logger.Info("helloworld endpoint hit!")
		return c.String(http.StatusOK, "Hello, World!")
	})
}

func CreateErrorResponse(code int, message string) (int, map[string]model.ErrorResponse) {
	errorResponse := map[string]model.ErrorResponse{
		"error": {
			Code:    code,
			Message: message,
		},
	}
	return code, errorResponse
}