package controller

import (
	"net/http"
	"strconv"
	"voxeti/backend/src/model/profile"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

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

	api.GET("/profile/:id", func(c echo.Context) error {
		logger.Info("profile endpoint hit!")
		id, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			return c.String(http.StatusBadRequest, "Invalid ID")
		}
		return c.JSON(http.StatusOK, profile.GetProfile(id))
	})
}
