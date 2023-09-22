package controller

import (
	"net/http"

	// "model/model.go"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

// type MongoController struct {
// 	model.Model
// }

func RegisterHandlers(e *echo.Echo, logger *pterm.Logger) {
	api := e.Group("/api")
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

	// api.GET("/profile", func(c echo.Context) error {
	// 	logger.Info("profile endpoint hit!")
	// 	return c.JSON(http.StatusOK, MongoController.ReturnProfile("test@test.com"))
	// })
}
