package user

import (
	"context"
	"net/mail"
	"reflect"
	"voxeti/backend/model"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateUser(user *schema.User, db *model.DB) (*primitive.ObjectID, *model.ErrorResponse) {
	// validate request body
	if reqErrors := validateCreateUser(user, db); reqErrors != "" {
		return nil, &model.ErrorResponse{
			Code:    400,
			Message: "Bad request: " + reqErrors,
		}
	}

	// insert user into database
	id, dbErr := CreateUserDB(user, db)
	if dbErr != nil {
		return nil, dbErr
	}

	return id, nil
}

func validateCreateUser(user *schema.User, db *model.DB) string {
	errors := ""
	v := reflect.ValueOf(*user)

	// check if user already exists
	if checkUserExists(user, db) {
		errors += "user with email already exists"
		return errors
	}

	// iterate through struct fields and use switch statement to validate each field
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldName := v.Type().Field(i).Name

		switch fieldName {
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
		case "PhoneNumber":
			areaCode := field.FieldByName("AreaCode")
			number := field.FieldByName("Number")

			if areaCode.String() == "" {
				errors += "areaCode is missing, "
			} else if len(areaCode.String()) < 1 || len(areaCode.String()) > 5 {
				errors += "areaCode must have 1-5 characters, "
			}

			if number.String() == "" {
				errors += "number is missing, "
			} else if len(number.String()) != 10 {
				errors += "number must have 1-10 characters, "
			}
		}
	}
	return errors
}

func isEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func checkUserExists(user *schema.User, db *model.DB) bool {

	// if real db is not being used, check mock db for user with same email
	if db.RealDB == nil {
		for _, v := range db.MockDB {
			if v.Email == user.Email {
				return true
			}
		}
		return false
	}

	// search for user by email
	coll := db.RealDB.Database("data").Collection("users")
	filter := bson.D{{Key: "email", Value: user.Email}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil
}
