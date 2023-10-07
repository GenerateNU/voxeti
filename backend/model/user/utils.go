package user

import (
	"context"
	"net/mail"
	"reflect"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ValidateCreateUser(user *schema.User, db *DB) string {
	// check if user already exists
	if checkUserExistsEmail(user.Email, db) {
		return "user with email already exists"
	}

	errors := validateUserFields(user)

	return errors
}

func ValidateUpdateUser(id *primitive.ObjectID, user *schema.User, db *DB) string {

	if !checkUserExistsId(id, db) {
		return "user does not exist"
	}

	// check if request email is different than email for user with id
	if isEmailUpdated(id, user.Email, db) {
		// check if user with new email already exists
		if checkUserExistsEmail(user.Email, db) {
			return "user with email already exists"
		}
	}

	errors := validateUserFields(user)

	return errors
}

func isEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func checkUserExistsEmail(email string, db *DB) bool {

	// if real db is not being used, check mock db for user with same email
	if db.RealDB == nil {
		for _, v := range db.MockDB {
			if v.Email == email {
				return true
			}
		}
		return false
	}

	// search for user by email
	coll := db.RealDB.Database("data").Collection("users")
	filter := bson.D{{Key: "email", Value: email}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil
}

func checkUserExistsId(id *primitive.ObjectID, db *DB) bool {

	// if real db is not being used, check mock db for user with same id
	if db.RealDB == nil {
		if _, ok := db.MockDB[*id]; ok {
			return true
		}
		return false
	}

	// search for user by id
	coll := db.RealDB.Database("data").Collection("users")
	filter := bson.D{{Key: "_id", Value: *id}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil
}

func isEmailUpdated(id *primitive.ObjectID, email string, db *DB) bool {
	// check if current email is the same as the updated email
	if db.RealDB == nil {
		if user, ok := db.MockDB[*id]; ok {
			return user.Email != email
		}
		return false
	}

	// search for user by id
	coll := db.RealDB.Database("data").Collection("users")
	filter := bson.D{{Key: "_id", Value: *id}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil && result.Email != email
}

// TODO: convert address to lat/long using geocoding api

func validateUserFields(user *schema.User) string {
	errors := ""
	v := reflect.ValueOf(*user)

	// iterate through struct fields and validate each field
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldName := v.Type().Field(i).Name

		// validate required fields
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
		case "Experience":
			if field.Int() < 1 || field.Int() > 3 {
				errors += "experience must be 1, 2, or 3, "
			}
		}
	}
	return errors
}
