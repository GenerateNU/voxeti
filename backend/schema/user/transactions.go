package user

import (
	"context"
	"voxeti/backend/schema"
	"voxeti/backend/utilities"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateUserDB(user *schema.User, dbClient *mongo.Client) (*primitive.ObjectID, *map[string]schema.ErrorResponse) {

	// insert user into db
	coll := dbClient.Database("data").Collection("users")
	result, err := coll.InsertOne(context.TODO(), user)

	if err != nil {
		_, errorResponse := utilities.CreateErrorResponse(500, err.Error())
		return nil, &errorResponse
	}

	// return object id of new user
	id := result.InsertedID.(primitive.ObjectID)
	return &id, nil
}

func GetAllUsersDB(dbClient *mongo.Client) ([]*schema.User, *map[string]schema.ErrorResponse) {

	// get all users from db
	coll := dbClient.Database("data").Collection("users")

	// Currently blank filter, can be changed in the future for algorithm
	filter := bson.D{}

	cursor, err := coll.Find(context.TODO(), filter)
	if err != nil {
		_, errorResponse := utilities.CreateErrorResponse(500, err.Error())
		return nil, &errorResponse
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
			_, errorResponse := utilities.CreateErrorResponse(404, "User not found")
			return nil, &errorResponse
		}
	}

	return users, nil
}

func GetUserByIdDB(id *primitive.ObjectID, dbClient *mongo.Client) (*schema.User, *map[string]schema.ErrorResponse) {

	// get user from db
	coll := dbClient.Database("data").Collection("users")
	var user schema.User
	err := coll.FindOne(context.TODO(), primitive.M{"_id": id}).Decode(&user)

	if err != nil {
		_, errorResponse := utilities.CreateErrorResponse(404, "User not found")
		return nil, &errorResponse
	}

	return &user, nil
}

func UpdateUserByIdDB(id *primitive.ObjectID, user *schema.User, dbClient *mongo.Client) (*primitive.ObjectID, *map[string]schema.ErrorResponse) {

	// update user in db
	coll := dbClient.Database("data").Collection("users")
	_, err := coll.UpdateOne(context.TODO(), primitive.M{"_id": id}, primitive.M{
		"$set": user,
	})

	if err != nil {
		_, errorResponse := utilities.CreateErrorResponse(404, "User not found")
		return nil, &errorResponse
	}

	// return object id of updated user
	return id, nil
}

func PatchUserByIdDB(id *primitive.ObjectID, user *schema.User, dbClient *mongo.Client) (*primitive.ObjectID, *map[string]schema.ErrorResponse) {

	// update user in db
	coll := dbClient.Database("data").Collection("users")

	filter := primitive.M{"_id": id}
	update := primitive.M{"$set": user}

	_, err := coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		_, errorResponse := utilities.CreateErrorResponse(500, err.Error())
		return nil, &errorResponse
	}
	//

	if err != nil {
		_, errorResponse := utilities.CreateErrorResponse(404, "User not found")
		return nil, &errorResponse
	}

	// return object id of updated user
	return id, nil
}

func DeleteUserByIdDB(id *primitive.ObjectID, dbClient *mongo.Client) (*primitive.ObjectID, *map[string]schema.ErrorResponse) {

	filter := bson.D{{Key: "_id", Value: id}}

	// update user in db
	coll := dbClient.Database("data").Collection("users")
	result, err := coll.DeleteOne(context.TODO(), filter)

	if result.DeletedCount == 0 || err != nil {
		_, errorResponse := utilities.CreateErrorResponse(404, "User not found")
		return nil, &errorResponse
	}

	// return object id of updated user
	return id, nil
}
