package user

import (
	"voxeti/backend/model"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateUser(user *schema.User, db *DB) (*primitive.ObjectID, *model.ErrorResponse) {
	// validate request body
	if reqErrors := ValidateCreateUser(user, db); reqErrors != "" {

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

// get user by id
func GetUserById(id *primitive.ObjectID, db *DB) (*schema.User, *model.ErrorResponse) {

	// get user from database
	user, dbErr := GetUserByIdDB(id, db)

	if dbErr != nil {
		return nil, dbErr
	}

	return user, nil
}

// update user by id
func UpdateUserById(id *primitive.ObjectID, user *schema.User, db *DB) (*primitive.ObjectID, *model.ErrorResponse) {

	// validate request body
	if reqErrors := ValidateUpdateUser(id, user, db); reqErrors != "" {

		return nil, &model.ErrorResponse{
			Code:    400,
			Message: "Bad request: " + reqErrors,
		}
	}

	// update user in database
	updatedId, dbErr := UpdateUserByIdDB(id, user, db)

	if dbErr != nil {
		return nil, dbErr
	}

	return updatedId, nil
}
