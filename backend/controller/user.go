package controller

import (
	"net/http"
	"voxeti/backend/model"
	"voxeti/backend/model/user"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

func RegisterUserHandlers(e *echo.Group, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/user")

	api.POST("", func(c echo.Context) error {
		logger.Info("create user endpoint hit!")

		// unmarshal request body into user struct
		u := schema.User{}
		if err := c.Bind(&u); err != nil {
			return c.JSON(http.StatusBadRequest, "Failed to unmarshal request body")
		}

		// create db struct that contains real db and mock db
		db := model.DB{
			RealDB: dbClient,
			MockDB: make(map[primitive.ObjectID]*schema.User),
		}

		id, err := user.CreateUser(&u, &db)

		if err != nil {
			return c.JSON(err.Code, err.Message)
		}
		// return object id of new user
		return c.JSON(http.StatusOK, *id)
	})
}
