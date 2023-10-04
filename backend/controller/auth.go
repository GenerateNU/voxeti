package controller

import (
	"net/http"
	"voxeti/backend/src/model"
	"voxeti/backend/src/model/auth"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterAuthHandlers(e *echo.Group, store *sessions.CookieStore, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/auth")

	api.POST("/login", func(c echo.Context) error {
		var creds model.Credentials

		if err := c.Bind(&creds); err != nil {
			return c.JSON(CreateErrorResponse(500, "Failed to unmarshal credentials"))
		}

		response, err := auth.Login(c, store, dbClient, creds)
		if err.Code != 0 {
			return c.JSON(CreateErrorResponse(err.Code, err.Message))
		}

		return c.JSON(http.StatusOK, response)
	})

	api.POST("/logout", func(c echo.Context) error {
		if err := auth.AuthenticateSession(c, store); err.Code != 0 {
			return c.JSON(CreateErrorResponse(err.Code, err.Message))
		}

		if err := auth.InvalidateUserSession(c, store); err.Code != 0 {
			return c.JSON(CreateErrorResponse(err.Code, err.Message))
		}
		return c.NoContent(http.StatusOK)
	})
}
