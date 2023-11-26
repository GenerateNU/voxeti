package controller

import (
	"net/http"
	"strconv"
	"voxeti/backend/schema"
	"voxeti/backend/schema/user"
	"voxeti/backend/utilities"

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
			return c.JSON(utilities.CreateErrorResponse(400, "Failed to unmarshal request body"))
		}

		newUser, err := user.CreateUser(&u, dbClient)

		if err != nil {
			return c.JSON(err.Code, err)
		}

		// authenticate new user: 
		

		// return new user
		return c.JSON(http.StatusOK, *newUser)
	})

	api.GET("/:id", func(c echo.Context) error {
		logger.Info("get user endpoint hit!")

		// get id from url
		id, err := primitive.ObjectIDFromHex(c.Param("id"))
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid id"))
		}

		user, userErr := user.GetUserById(&id, dbClient)

		if userErr != nil {
			return c.JSON(userErr.Code, userErr)
		}

		return c.JSON(http.StatusOK, *user)
	})

	api.GET("", func(c echo.Context) error {
		logger.Info("get all user endpoint hit!")

		page := c.QueryParam("page")
		limit := c.QueryParam("limit")

		if page == "" || limit == "" {
			return c.JSON(utilities.CreateErrorResponse(400, "Missing page or limit"))
		}

		pageInt, pageErr := strconv.Atoi(page)
		limitInt, limitErr := strconv.Atoi(limit)

		if pageErr != nil || limitErr != nil || pageInt < 1 || limitInt < 0 {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid page or limit"))
		}

		users, userErr := user.GetAllUsers(pageInt, limitInt, dbClient)

		if userErr != nil {
			return c.JSON(userErr.Code, userErr)
		}

		return c.JSON(http.StatusOK, users)
	})

	api.PATCH("/:id", func(c echo.Context) error {
		logger.Info("patch user endpoint hit!")

		// get id from url
		id, err := primitive.ObjectIDFromHex(c.Param("id"))
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid id"))
		}

		// unmarshal request body into user struct
		u := schema.User{}
		if err := c.Bind(&u); err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Failed to unmarshal request body"))
		}

		patchedUser, patchErr := user.PatchUserById(&id, &u, dbClient)

		if patchErr != nil {
			return c.JSON(patchErr.Code, patchErr)
		}

		// return patched user
		return c.JSON(http.StatusOK, *patchedUser)
	})
	api.PUT("/:id", func(c echo.Context) error {
		logger.Info("update user endpoint hit!")

		// get id from url
		id, err := primitive.ObjectIDFromHex(c.Param("id"))
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid id"))
		}

		// unmarshal request body into user struct
		u := schema.User{}
		if err := c.Bind(&u); err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Failed to unmarshal request body"))
		}

		updatedUser, updateErr := user.UpdateUserById(&id, &u, dbClient)

		if updateErr != nil {
			return c.JSON(updateErr.Code, updateErr)
		}

		// return updated user
		return c.JSON(http.StatusOK, *updatedUser)
	})

	api.DELETE("/:id", func(c echo.Context) error {
		logger.Info("delete user endpoint hit!")

		// get id from url
		id, err := primitive.ObjectIDFromHex(c.Param("id"))
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid id"))
		}

		// unmarshal request body into user struct
		u := schema.User{}
		if err := c.Bind(&u); err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Failed to unmarshal request body"))
		}

		deletedUser, deleteErr := user.DeleteUserById(&id, dbClient)

		if deleteErr != nil {
			return c.JSON(deleteErr.Code, deleteErr)
		}

		// return deleted user
		return c.JSON(http.StatusOK, *deletedUser)
	})
}
