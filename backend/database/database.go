package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/pterm/pterm"
)

// Setup for when backend gets created
func Setup(dbClient *mongo.Client, logger *pterm.Logger, resetDb bool) {
	if resetDb {
		CreateUserCollection(dbClient, logger)
		CreateJobCollection(dbClient, logger)
	}
}

func CreateUserCollection(dbClient *mongo.Client, logger *pterm.Logger) {

	// insert user into real db
	database := dbClient.Database("data")

	dropErr := database.Collection("users").Drop(context.TODO())
	if dropErr != nil {
		logger.Fatal(dropErr.Error())
	}

	// MongoDB schema validation
	userSchema := bson.M{
		"bsonType": "object",
		"title":    "User Object Validation",
		"required": []string{
			"firstName",
			"lastName",
			"email",
			"password",
			"addresses",
			"phoneNumber",
			"experience",
		},
		"properties": bson.M{
			"firstName": bson.M{
				"bsonType":    "string",
				"minLength":   1,
				"maxLength":   50,
				"description": "'firstName' must be a string, length range of [1,50] and is required",
			},
			"lastName": bson.M{
				"bsonType":    "string",
				"minLength":   1,
				"maxLength":   50,
				"description": "'lastName' must be a string, length range of [1,50] and is required",
			},
			"email": bson.M{
				"bsonType":    "string",
				"description": "'email' must be a string, in the format of xxx@xxx.xx, and is required",
			},
			"password": bson.M{
				"bsonType":    "string",
				"description": "'password' must be a string, should be encrypted",
			},
			"addresses": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "object",
					"required": []string{"name", "line1", "zipCode", "city", "state", "country"},
					"properties": bson.M{
						"name": bson.M{
							"bsonType":    "string",
							"description": "'name' must be a string",
						},
						"line1": bson.M{
							"bsonType":    "string",
							"description": "'primaryAddress' must be a string",
						},
						"line2": bson.M{
							"bsonType":    "string",
							"description": "'secondaryAddress' must be a string",
						},
						"zipCode": bson.M{
							"bsonType":    "string",
							"description": "'zipCode' must be a string",
						},
						"city": bson.M{
							"bsonType":    "string",
							"description": "'city' must be a string",
						},
						"state": bson.M{
							"bsonType":    "string",
							"description": "'state' must be a string",
						},
						"country": bson.M{
							"bsonType":    "string",
							"description": "'country' must be a string",
						},
						"location": bson.M{
							"bsonType": "object",
							"properties": bson.M{
								"type": bson.M{
									"bsonType":    "string",
									"description": "should be of type Point",
								},
								"coordinates": bson.M{
									"bsonType":    "array",
									"items":       bson.M{"bsonType": "double"},
									"description": "latitude and longitude",
								},
							},
						},
					},
				},
			},
			"phoneNumber": bson.M{
				"bsonType": "object",
				"required": []string{"countryCode", "number"},
				"properties": bson.M{
					"countryCode": bson.M{
						"bsonType":    "string",
						"minLength":   1,
						"maxLength":   5,
						"description": "'countryCode' must be a string, length range of [1,5], and is required",
					},
					"number": bson.M{
						"bsonType":    "string",
						"minLength":   10,
						"maxLength":   10,
						"description": "'number' must be a string, length of 10, and is required",
					},
				},
			},
			"experience": bson.M{
				"bsonType":    "int",
				"minimum":     1,
				"maximum":     3,
				"description": "'experience' must be 1,2, or 3 and is required",
			},
			"printers": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "object",
					"required": []string{"supportedFilament", "dimensions"},
					"properties": bson.M{
						"supportedFilament": bson.M{
							"bsonType": "array",
							"items": bson.M{
								"bsonType":    "string",
								"enum":        []string{"PLA", "ABS", "TPE"},
								"description": "must be of PLA, ABS, or TPE",
							},
						},
						"dimensions": bson.M{
							"bsonType": "object",
							"required": []string{"height", "width", "depth"},
							"properties": bson.M{
								"height": bson.M{
									"bsonType":    "long",
									"minimum":     0,
									"description": "must be a positive integer, measured in meters",
								},
								"width": bson.M{
									"bsonType":    "long",
									"minimum":     0,
									"description": "must be a positive integer, measured in meters",
								},
								"depth": bson.M{
									"bsonType":    "long",
									"minimum":     0,
									"description": "must be a positive integer, measured in meters",
								},
							},
						}},
				},
			},
			"availableFilament": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "object",
					"required": []string{"type", "color", "pricePerUnit"},
					"properties": bson.M{
						"type": bson.M{
							"bsonType":    "string",
							"enum":        []string{"PLA", "ABS", "TPE"},
							"description": "must be of PLA, ABS, or TPE",
						},
						"color": bson.M{
							"bsonType":    "string",
							"description": "must be a string",
						},
						"pricePerUnit": bson.M{
							"bsonType":    "long",
							"minimum":     0,
							"description": "must be a non-negative cost",
						}},
				},
			},
		},
	}

	validator := bson.M{
		"$jsonSchema": userSchema,
	}

	opts := options.CreateCollection().SetValidator(validator)

	createErr := database.CreateCollection(context.TODO(), "users", opts)
	if createErr != nil {
		logger.Fatal(createErr.Error())
	}

	// Add index/constraint to make sure there are no duplicate emails
	indexModel := mongo.IndexModel{
		Keys: bson.D{{Key: "email", Value: 1}},
	}

	// Inserts the index/constraint
	_, indexErr := database.Collection("users").Indexes().CreateOne(context.TODO(), indexModel)
	if indexErr != nil {
		logger.Fatal(indexErr.Error())
	}
}

func CreateJobCollection(dbClient *mongo.Client, logger *pterm.Logger) {

	// insert job into real db
	database := dbClient.Database("data")

	dropErr := database.Collection("jobs").Drop(context.TODO())
	if dropErr != nil {
		logger.Fatal(dropErr.Error())
	}

	opts := options.CreateCollection()

	createErr := database.CreateCollection(context.TODO(), "jobs", opts)
	if createErr != nil {
		logger.Fatal(createErr.Error())
	}

	// Add geospatial index for the 'location' field
	geoIndexModel := mongo.IndexModel{
		Keys: bson.D{{Key: "shippingAddress.location", Value: "2dsphere"}},
	}

	_, geoIndexErr := database.Collection("jobs").Indexes().CreateOne(context.TODO(), geoIndexModel)
	if geoIndexErr != nil {
		logger.Fatal(geoIndexErr.Error())
	}
}
