package registration

import (
	"reflect"
	"voxeti/backend/model"
)

func CreateUser(user model.User) model.ErrorResponse {
	errors := validateCreateUser(user)
	if errors != "" {
		return model.ErrorResponse{
			Code:    400,
			Message: "Missing field(s):" + errors,
		}
	}
	dbErr := CreateUserDB(user)
	if dbErr.Code != 0 {
		return dbErr
	}
	return model.ErrorResponse{}
}

func validateCreateUser(user model.User) string {
	errors := ""
	v := reflect.ValueOf(user)
	for i := 0; i < v.NumField(); i++ {
		if v.Field(i).IsZero() {
			errors += ", " + v.Type().Field(i).Tag.Get("json")
		}
	}
	return errors
}
