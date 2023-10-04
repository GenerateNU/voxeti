package auth

import (
	"context"
	"os"
	"voxeti/backend/src/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetUserByEmail(email string, dbClient *mongo.Client) (model.User, model.ErrorResponse) {
	// Access the users collection and initialize a filter:
	usersCollection := dbClient.Database(os.Getenv("DATABASE_NAME")).Collection("users");
	filter := bson.D{{Key: "email", Value: email}}

	// Retrieve the user:
	var user model.User
	if err := usersCollection.FindOne(context.Background(), filter).Decode(&user); err != nil {
		return model.User{}, model.ErrorResponse{Code: 400, Message: "User does not exist!"}
	}

	// Return the user:
	return user, model.ErrorResponse{}
}