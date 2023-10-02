package registration

import (
	"context"
	"voxeti/backend/model"

	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateUserDB(user *model.User, dbClient *mongo.Client, logger *pterm.Logger) (string, *model.ErrorResponse) {

	coll := dbClient.Database("data").Collection("users")
	result, err := coll.InsertOne(context.TODO(), user)

	if err != nil {
		return "", &model.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		}
	}

	id := result.InsertedID.(primitive.ObjectID).Hex()

	logger.Info("Inserted a single document: " + id)

	return id, nil
}
