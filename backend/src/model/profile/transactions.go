package profile

// import (
// 	"context"
// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/mongo"
// 	"go.mongodb.org/mongo-driver/mongo/options"
// )

func GetProfileFromDB(id int64) (Profile, error) {
	// coll := client.Database("voxeti").Collection("users")
	// filter := bson.D{{"email", email}}

	// var result Profile
	// err = coll.FindOne(context.TODO(), filter).Decode(&result)
	// if err != nil {

	// 	if err == mongo.ErrNoDocuments {
	// 	// This error means your query did not match any documents.
	// 		return
	// 	}
	// panic(err)
	// }
	profile := Profile{Email: "test@gmail.com", Name: "First Last", Location: "Boston", UserType: "Designer"}
	return profile, nil
}
