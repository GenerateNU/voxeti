package user

import (
	"voxeti/backend/model"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateUser(user *schema.User, db *DB) (*primitive.ObjectID, *model.ErrorResponse) {
	// validate request body
	if reqError := ValidateCreateUser(user, db); reqError != nil {
		return nil, reqError
	}

	// insert user into database
	id, dbErr := CreateUserDB(user, db)
	if dbErr != nil {
		return nil, dbErr
	}

	return id, nil
}

func GetUserById(id *primitive.ObjectID, db *DB) (*schema.User, *model.ErrorResponse) {

	// get user from database
	user, dbErr := GetUserByIdDB(id, db)

	if dbErr != nil {
		return nil, dbErr
	}

	return user, nil
}

func UpdateUserById(id *primitive.ObjectID, user *schema.User, db *DB) (*primitive.ObjectID, *model.ErrorResponse) {

	// validate request body
	if reqError := ValidateUpdateUser(id, user, db); reqError != nil {
		return nil, reqError
	}

	// update user in database
	updatedId, dbErr := UpdateUserByIdDB(id, user, db)

	if dbErr != nil {
		return nil, dbErr
	}

	return updatedId, nil
}
