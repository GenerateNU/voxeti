package controller

import (
	"net/http"
	"voxeti/backend/schema"
	"voxeti/backend/schema/auth"
	"voxeti/backend/utilities"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterAuthHandlers(e *echo.Group, store *sessions.CookieStore, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/auth")

	// Log in a user:
	api.POST("/login", func(c echo.Context) error {
		var creds schema.Credentials

		if err := c.Bind(&creds); err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Failed to unmarshal credentials"))
		}

		response, err := auth.Login(c, store, dbClient, creds)
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(err.Code, err.Message))
		}

		return c.JSON(http.StatusOK, response)
	})

	// Logout a user:
	api.POST("/logout", func(c echo.Context) error {
		if err := auth.InvalidateUserSession(c, store); err != nil {
			return c.JSON(utilities.CreateErrorResponse(err.Code, err.Message))
		}
		return c.NoContent(http.StatusOK)
	})

	// Handle google login / sign-up
	api.POST("/google-provider", func(c echo.Context) error {
		var accessToken schema.GoogleAccessToken

		if err := c.Bind(&accessToken); err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Failed to unmarshal accessToken"))
		}

		googleSSOUser, err := auth.GoogleSSOAuthentication(c, store, accessToken, dbClient)
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(err.Code, err.Message))
		}

		return c.JSON(http.StatusOK, googleSSOUser)
	})

	// Check if a user is authenticated. If it passes middleware, the user is authed:
	api.POST("/authenticate", func(c echo.Context) error {
		return c.NoContent(http.StatusOK)
	})
}
