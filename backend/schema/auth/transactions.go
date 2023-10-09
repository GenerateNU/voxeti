package auth

import (
	"context"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetUserByEmail(email string, dbClient *mongo.Client) (*schema.User, *schema.ErrorResponse) {
	errResponse := &schema.ErrorResponse{}

	// Access the users collection and initialize a filter:
	usersCollection := dbClient.Database(schema.DatabaseName).Collection("users")
	filter := bson.D{{Key: "email", Value: email}}

	// Retrieve the user:
	user := &schema.User{}
	if err := usersCollection.FindOne(context.Background(), filter).Decode(&user); err != nil {
		errResponse.Code = 400
		errResponse.Message = "User does not exist!"
	}

	// Return the user:
	return user, nil
}
