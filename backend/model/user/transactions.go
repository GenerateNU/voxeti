package user

import (
	"context"
	"time"
	"voxeti/backend/model"

	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateUserDB(user *schema.User, dbClient *model.DB) (*primitive.ObjectID, *model.ErrorResponse) {

	// if real db is nil, insert user into mock db
	if dbClient.RealDB == nil {
		id := primitive.NewObjectIDFromTimestamp(time.Now())
		user.Id = id
		dbClient.MockDB[id] = user
		return &id, nil
	}

	// insert user into real db
	coll := dbClient.RealDB.Database("data").Collection("users")
	result, err := coll.InsertOne(context.TODO(), user)

	if err != nil {
		return nil, &model.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		}
	}

	// return object id of new user
	return result.InsertedID.(*primitive.ObjectID), nil
}
