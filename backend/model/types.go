package model

import (
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// contains real db and mock db for testing
type DB struct {
	RealDB *mongo.Client
	MockDB map[primitive.ObjectID]*schema.User
}
