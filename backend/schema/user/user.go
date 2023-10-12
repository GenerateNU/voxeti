package user

import (
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateUser(user *schema.User, dbClient *mongo.Client) (*primitive.ObjectID, *map[string]schema.ErrorResponse) {
	// validate request body
	if reqError := ValidateCreateUser(user, dbClient); reqError != nil {
		return nil, reqError
	}

	// update location field for each address
	locErr := UpdateLocations(user)
	if locErr != nil {
		return nil, locErr
	}

	// insert user into database
	id, dbErr := CreateUserDB(user, dbClient)
	if dbErr != nil {
		return nil, dbErr
	}

	return id, nil
}

func GetUserById(id *primitive.ObjectID, dbClient *mongo.Client) (*schema.User, *map[string]schema.ErrorResponse) {

	// get user from database
	user, dbErr := GetUserByIdDB(id, dbClient)

	if dbErr != nil {
		return nil, dbErr
	}

	return user, nil
}

func GetAllUsers(dbClient *mongo.Client) ([]*schema.User, *map[string]schema.ErrorResponse) {

	// get user from database
	users, dbErr := GetAllUsersDB(dbClient)

	if dbErr != nil {
		return nil, dbErr
	}

	return users, nil
}

func UpdateUserById(id *primitive.ObjectID, user *schema.User, dbClient *mongo.Client) (*primitive.ObjectID, *map[string]schema.ErrorResponse) {

	// validate request body
	if reqError := ValidateUpdateUser(id, user, dbClient); reqError != nil {
		return nil, reqError
	}

	// update location field for each address
	locErr := UpdateLocations(user)
	if locErr != nil {
		return nil, locErr
	}

	// update user in database
	updatedId, dbErr := UpdateUserByIdDB(id, user, dbClient)
	if dbErr != nil {
		return nil, dbErr
	}

	return updatedId, nil
}

func PatchUserById(id *primitive.ObjectID, user *schema.User, dbClient *mongo.Client) (*primitive.ObjectID, *map[string]schema.ErrorResponse) {

	// update location field for each address
	locErr := UpdateLocations(user)
	if locErr != nil {
		return nil, locErr
	}

	// update user in database
	updatedId, dbErr := PatchUserByIdDB(id, user, dbClient)
	if dbErr != nil {
		return nil, dbErr
	}

	return updatedId, nil
}
