package user

import (
	"context"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func createUserDB(user *schema.User, dbClient *mongo.Client) (*primitive.ObjectID, *schema.ErrorResponse) {

	// insert user into db
	coll := dbClient.Database(schema.DatabaseName).Collection("users")
	result, err := coll.InsertOne(context.TODO(), user)

	if err != nil {
		return nil, &schema.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		}
	}

	// return object id of new user
	id := result.InsertedID.(primitive.ObjectID)
	return &id, nil
}

func getAllUsersDB(dbClient *mongo.Client) ([]*schema.User, *schema.ErrorResponse) {

	// get all users from db
	coll := dbClient.Database(schema.DatabaseName).Collection("users")

	// Currently blank filter, can be changed in the future for algorithm
	filter := bson.D{}

	cursor, err := coll.Find(context.TODO(), filter)
	if err != nil {
		return nil, &schema.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		}
	}
	// end find

	var results []*schema.User
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	// Takes query results and adds to a list to return
	var users []*schema.User
	for _, result := range results {
		decodeError := cursor.Decode(&result)
		if decodeError != nil {
			users = append(users, result)
		} else {
			return nil, &schema.ErrorResponse{
				Code:    404,
				Message: "User not found",
			}
		}
	}

	return users, nil
}

func getUserByIdDB(id *primitive.ObjectID, dbClient *mongo.Client) (*schema.User, *schema.ErrorResponse) {

	// get user from db
	coll := dbClient.Database(schema.DatabaseName).Collection("users")
	var user schema.User
	err := coll.FindOne(context.TODO(), primitive.M{"_id": id}).Decode(&user)

	if err != nil {
		return nil, &schema.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	return &user, nil
}

func updateUserByIdDB(id *primitive.ObjectID, user *schema.User, dbClient *mongo.Client) (*primitive.ObjectID, *schema.ErrorResponse) {

	// update user in db
	coll := dbClient.Database(schema.DatabaseName).Collection("users")
	_, err := coll.UpdateOne(context.TODO(), primitive.M{"_id": id}, primitive.M{
		"$set": user,
	})

	if err != nil {
		return nil, &schema.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// return object id of updated user
	return id, nil
}

func patchUserByIdDB(id *primitive.ObjectID, user *schema.User, dbClient *mongo.Client) (*primitive.ObjectID, *schema.ErrorResponse) {

	// update user in db
	coll := dbClient.Database(schema.DatabaseName).Collection("users")

	filter := primitive.M{"_id": id}
	update := primitive.M{"$set": user}

	_, err := coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, &schema.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		}
	}

	if err != nil {
		return nil, &schema.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// return object id of updated user
	return id, nil
}

func DeleteUserByIdDB(id *primitive.ObjectID, dbClient *mongo.Client) (*primitive.ObjectID, *schema.ErrorResponse) {

	filter := bson.D{{Key: "_id", Value: id}}

	// update user in db
	coll := dbClient.Database(schema.DatabaseName).Collection("users")
	result, err := coll.DeleteOne(context.TODO(), filter)

	if result.DeletedCount == 0 || err != nil {
		return nil, &schema.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// return object id of updated user
	return id, nil
}

func checkUserExistsEmail(email string, dbClient *mongo.Client) bool {

	// search for user by email
	coll := dbClient.Database(schema.DatabaseName).Collection("users")
	filter := bson.D{{Key: "email", Value: email}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil
}

func checkUserExistsId(id *primitive.ObjectID, dbClient *mongo.Client) bool {

	// search for user by id
	coll := dbClient.Database(schema.DatabaseName).Collection("users")
	filter := bson.D{{Key: "_id", Value: *id}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil
}

func isEmailUpdated(id *primitive.ObjectID, email string, dbClient *mongo.Client) bool {

	// search for user by id
	coll := dbClient.Database(schema.DatabaseName).Collection("users")
	filter := bson.D{{Key: "_id", Value: *id}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil && result.Email != email
}

func AddJobNotification(id *primitive.ObjectID, jobNotification *schema.JobNotification, dbClient *mongo.Client) *schema.ErrorResponse {

	coll := dbClient.Database(schema.DatabaseName).Collection("users")

	filter := primitive.M{"_id": id}
	update := primitive.M{"$push": primitive.M{"jobNotifications": jobNotification}}

	_, err := coll.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return &schema.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		}
	}

	return nil
}
