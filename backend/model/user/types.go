package user

import (
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// contains real db and mock db for testing
type DB struct {
	RealDB *mongo.Client
	MockDB map[primitive.ObjectID]*schema.User
}
