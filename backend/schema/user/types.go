package user

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type IdResponse struct {
	Id primitive.ObjectID `json:"id" bson:"_id"`
}
