package user

import (
	"context"
	"time"
	"voxeti/backend/model"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateUserDB(user *schema.User, db *DB) (*primitive.ObjectID, *model.ErrorResponse) {

	// if real db is nil, insert user into mock db
	if db.RealDB == nil {
		id := primitive.NewObjectIDFromTimestamp(time.Now())
		user.Id = id
		db.MockDB[id] = user
		return &id, nil
	}

	// insert user into real db
	coll := db.RealDB.Database("data").Collection("users")
	result, err := coll.InsertOne(context.TODO(), user)

	if err != nil {
		return nil, &model.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		}
	}

	// return object id of new user
	id := result.InsertedID.(primitive.ObjectID)
	return &id, nil
}

func GetAllUsersDB(db *DB) ([]*schema.User, *model.ErrorResponse) {
	// if real db is nil, get user from mock db
	if db.RealDB == nil {
		if users, ok := Values(db.MockDB); ok {
			return users, nil
		}
		return nil, &model.ErrorResponse{
			Code:    404,
			Message: "Users not found",
		}
	}

	// get all users from real db
	coll := db.RealDB.Database("data").Collection("users")

	// Currently blank filter, can be changed in the future for algorithm
	filter := bson.D{}

	cursor, err := coll.Find(context.TODO(), filter)
	if err != nil {
		panic(err)
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
			return nil, &model.ErrorResponse{
				Code:    404,
				Message: "User not found",
			}
		}
	}

	return users, nil
}

func GetUserByIdDB(id *primitive.ObjectID, db *DB) (*schema.User, *model.ErrorResponse) {

	// if real db is nil, get user from mock db
	if db.RealDB == nil {
		if user, ok := db.MockDB[*id]; ok {
			return user, nil
		}
		return nil, &model.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// get user from real db
	coll := db.RealDB.Database("data").Collection("users")
	var user schema.User
	err := coll.FindOne(context.TODO(), primitive.M{"_id": id}).Decode(&user)

	if err != nil {
		return nil, &model.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	return &user, nil
}

func UpdateUserByIdDB(id *primitive.ObjectID, user *schema.User, db *DB) (*primitive.ObjectID, *model.ErrorResponse) {

	// if real db is nil, update user in mock db
	if db.RealDB == nil {
		if _, ok := db.MockDB[*id]; ok {
			db.MockDB[*id] = user
			return id, nil
		}
		return nil, &model.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// update user in real db
	coll := db.RealDB.Database("data").Collection("users")
	_, err := coll.UpdateOne(context.TODO(), primitive.M{"_id": id}, primitive.M{
		"$set": user,
	})

	if err != nil {
		return nil, &model.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// return object id of updated user
	return id, nil
}

func PatchUserByIdDB(id *primitive.ObjectID, user *schema.User, db *DB) (*primitive.ObjectID, *model.ErrorResponse) {

	// if real db is nil, update user in mock db
	if db.RealDB == nil {
		if _, ok := db.MockDB[*id]; ok {
			db.MockDB[*id] = user
			return id, nil
		}
		return nil, &model.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// update user in real db
	coll := db.RealDB.Database("data").Collection("users")

	filter := primitive.M{"_id": id}
	update := primitive.M{"$set": user}

	_, err := coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		panic(err)
	}
	//

	if err != nil {
		return nil, &model.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// return object id of updated user
	return id, nil
}

func DeleteUserByIdDB(id *primitive.ObjectID, db *DB) (*primitive.ObjectID, *model.ErrorResponse) {

	// if real db is nil, update user in mock db
	if db.RealDB == nil {
		if _, ok := db.MockDB[*id]; ok {
			return id, nil
		}
		return nil, &model.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	filter := bson.D{{Key: "_id", Value: id}}

	// update user in real db
	coll := db.RealDB.Database("data").Collection("users")
	result, err := coll.DeleteOne(context.TODO(), filter)

	if result.DeletedCount == 0 || err != nil {
		return nil, &model.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// return object id of updated user
	return id, nil
}
