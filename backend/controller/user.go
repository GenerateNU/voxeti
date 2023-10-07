package controller

import (
	"net/http"
	"voxeti/backend/model/user"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

func RegisterUserHandlers(e *echo.Group, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/users")

	api.POST("", func(c echo.Context) error {
		logger.Info("create user endpoint hit!")

		// unmarshal request body into user struct
		u := schema.User{}
		if err := c.Bind(&u); err != nil {
			return c.JSON(http.StatusBadRequest, "Failed to unmarshal request body")
		}

		// create db struct that contains real db and mock db
		db := user.DB{
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

	api.GET("/:id", func(c echo.Context) error {
		logger.Info("get user endpoint hit!")

		// get id from url
		id, err := primitive.ObjectIDFromHex(c.Param("id"))
		if err != nil {
			return c.JSON(http.StatusBadRequest, "Invalid id")
		}

		// create db struct that contains real db and mock db
		db := user.DB{
			RealDB: dbClient,
			MockDB: make(map[primitive.ObjectID]*schema.User),
		}

		user, userErr := user.GetUserById(&id, &db)

		if err != nil {
			return c.JSON(userErr.Code, userErr.Message)
		}

		// NEED TO ADD JSON TAGS TO SCHEMA SO USER DISPLAYS CORRECTLY
		return c.JSON(http.StatusOK, *user)
	})

	api.PUT("/:id", func(c echo.Context) error {
		logger.Info("update user endpoint hit!")

		// get id from url
		id, err := primitive.ObjectIDFromHex(c.Param("id"))
		if err != nil {
			return c.JSON(http.StatusBadRequest, "Invalid id")
		}

		// unmarshal request body into user struct
		u := schema.User{}
		if err := c.Bind(&u); err != nil {
			return c.JSON(http.StatusBadRequest, "Failed to unmarshal request body")
		}

		// create db struct that contains real db and mock db
		db := user.DB{
			RealDB: dbClient,
			MockDB: make(map[primitive.ObjectID]*schema.User),
		}

		updatedId, updateErr := user.UpdateUserById(&id, &u, &db)

		if updateErr != nil {
			return c.JSON(updateErr.Code, updateErr.Message)
		}

		// return object id of updated user
		return c.JSON(http.StatusOK, *updatedId)
	})
}
