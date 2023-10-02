package registration

import (
	"reflect"
	"voxeti/backend/model"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateUser(c echo.Context, dbClient *mongo.Client, logger *pterm.Logger) (*model.UserResponse, *model.ErrorResponse) {
	user := model.User{}
	if err := c.Bind(&user); err != nil {
		return nil, &model.ErrorResponse{
			Code:    400,
			Message: "Invalid request body",
		}
	}

	// validate request body
	if reqErrors := validateCreateUser(&user); reqErrors != "" {
		return nil, &model.ErrorResponse{
			Code:    400,
			Message: "Missing field(s):" + reqErrors,
		}
	}

	// insert user into database
	id, dbErr := CreateUserDB(&user, dbClient, logger)
	if dbErr != nil {
		return nil, dbErr
	}

	return &model.UserResponse{
		Id:   id,
		User: user,
	}, nil
}

func validateCreateUser(user *model.User) string {
	errors := ""
	v := reflect.ValueOf(*user)

	// check that no fields are empty
	for i := 0; i < v.NumField(); i++ {

		// if field is PhoneNumber, check that nested fields are not empty
		if v.Type().Field(i).Name == "PhoneNumber" {
			phone := v.Field(i)
			for j := 0; j < phone.NumField(); j++ {
				if phone.Field(j).IsZero() {
					errors += " " + phone.Type().Field(j).Tag.Get("bson") + ","
				}
			}
			continue
		}

		if v.Field(i).IsZero() {
			errors += " " + v.Type().Field(i).Tag.Get("bson") + ","
		}
	}
	return errors
}
