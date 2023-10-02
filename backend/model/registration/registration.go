package registration

import (
	"context"
	"net/mail"
	"reflect"
	"time"
	"voxeti/backend/model"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/bson"
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
	if reqErrors := validateCreateUser(&user, dbClient); reqErrors != "" {
		return nil, &model.ErrorResponse{
			Code:    400,
			Message: "Bad request: " + reqErrors,
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

func validateCreateUser(user *model.User, dbClient *mongo.Client) string {
	errors := ""
	v := reflect.ValueOf(*user)

	// check if user already exists
	if checkUserExists(user, dbClient) {
		errors += "user with username already exists"
		return errors
	}

	// iterate through struct fields and use switch statement to validate each field
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldName := v.Type().Field(i).Name

		switch fieldName {
		case "Username":
			if field.String() == "" {
				errors += "username is missing, "
			} else if len(field.String()) < 4 || len(field.String()) > 20 {
				errors += "username must have 4-20 characters, "
			}
		case "FirstName":
			if field.String() == "" {
				errors += "firstName is missing, "
			} else if len(field.String()) < 1 || len(field.String()) > 50 {
				errors += "firstName must have 1-50 characters, "
			}
		case "LastName":
			if field.String() == "" {
				errors += "lastName is missing, "
			} else if len(field.String()) < 1 || len(field.String()) > 50 {
				errors += "lastName must have 1-50 characters, "
			}
		case "Email":
			if field.String() == "" {
				errors += "email is missing, "
			} else if !isEmail(field.String()) {
				errors += "email is invalid, "
			}
		case "Birthday":
			if field.String() == "" {
				errors += "birthday is missing, "
			} else if !isDate(field.String()) {
				errors += "birthday must be YYYY-MM-DD and in the past, "
			}
		case "PhoneNumber":
			countryCode := field.FieldByName("CountryCode")
			number := field.FieldByName("Number")

			if countryCode.String() == "" {
				errors += "countryCode is missing, "
			} else if len(countryCode.String()) < 1 || len(countryCode.String()) > 5 {
				errors += "countryCode must have 1-5 characters, "
			}

			if number.String() == "" {
				errors += "number is missing, "
			} else if len(number.String()) != 10 {
				errors += "number must have 1-10 characters, "
			}
		case "UserType":
			if field.String() == "" {
				errors += "userType is missing, "
			} else if field.String() != "Designer" && field.String() != "Producer" {
				errors += "userType must be either Designer or Producer, "
			}
		}
	}
	return errors
}

func isEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func isDate(date string) bool {
	t, err := time.Parse("2006-01-02", date)

	difference := time.Since(t)

	return err == nil && difference > 0
}

func checkUserExists(user *model.User, dbClient *mongo.Client) bool {

	// search for user by username
	coll := dbClient.Database("data").Collection("users")
	filter := bson.D{{Key: "username", Value: user.Username}}
	var result model.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil
}
