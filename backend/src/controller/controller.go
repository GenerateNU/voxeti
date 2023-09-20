package controller

import (
	"net/http"
	"voxeti/backend/src/model/auth"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

func RegisterHandlers(e *echo.Echo, logger *pterm.Logger) {
	api := e.Group("/api")

	secureRoutes := api.Group("/secure")
	secureRoutes.Use(model.ValidateJWTMiddleware)

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

	api.GET("/login", func(c echo.Context) error {
		var creds model.Credentials

		if err := c.Bind(&creds); err != nil {
			pterm.Println(err)
			return c.String(http.StatusBadRequest, "Failed to unmarshal credentials")
		}

		token, err := model.Login(creds)

		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		return c.JSON(http.StatusOK, token)
	})

	secureRoutes.GET("/auth-route", func(c echo.Context) error {
		return c.JSON(http.StatusOK, "You have reached the secret route!")
	})
}
