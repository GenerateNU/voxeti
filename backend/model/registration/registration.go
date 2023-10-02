package registration

import (
	"reflect"
	"voxeti/backend/model"

	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateUser(user model.User, dbClient *mongo.Client, logger *pterm.Logger) model.ErrorResponse {
	if errors := validateCreateUser(user); errors != "" {
		return model.ErrorResponse{
			Code:    400,
			Message: "Missing field(s):" + errors,
		}
	}
	if dbErr := CreateUserDB(user, dbClient, logger); dbErr.Code != 0 {
		return dbErr
	}
	return model.ErrorResponse{}
}

func validateCreateUser(user model.User) string {
	errors := ""
	v := reflect.ValueOf(user)
	for i := 0; i < v.NumField(); i++ {
		// if type is PhoneNumber, check that nested fields are not empty
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
