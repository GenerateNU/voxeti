package controller

import (
	"net/http"
	"voxeti/backend/model"
	"voxeti/backend/model/registration"

	"go.mongodb.org/mongo-driver/mongo"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

func RegisterHandlersUserRegistration(e *echo.Group, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/user")

	api.POST("/create", func(c echo.Context) error {
		logger.Info("user registration endpoint hit!")
		user := model.User{}
		c.Bind(&user)
		err := registration.CreateUser(user, dbClient, logger)
		if err.Code != 0 {
			return c.JSON(err.Code, err)
		}
		return c.JSON(http.StatusOK, user)
	})

}
