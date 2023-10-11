package user

import (
	"context"
	"net/mail"
	"reflect"
	"voxeti/backend/model"
	"voxeti/backend/schema"

	"github.com/paulmach/orb"
	"github.com/paulmach/orb/geojson"
	"googlemaps.github.io/maps"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ValidateCreateUser(user *schema.User, db *DB) *model.ErrorResponse {
	// check if user already exists
	if checkUserExistsEmail(user.Email, db) {
		return &model.ErrorResponse{
			Code:    400,
			Message: "User with email already exists",
		}
	}

	errors := validateUserFields(user)

	if errors != "" {
		return &model.ErrorResponse{
			Code:    400,
			Message: "Bad request: " + errors,
		}
	}

	return nil
}

func ValidateUpdateUser(id *primitive.ObjectID, user *schema.User, db *DB) *model.ErrorResponse {

	if !checkUserExistsId(id, db) {
		return &model.ErrorResponse{
			Code:    404,
			Message: "User not found",
		}
	}

	// check if request email is different than email for user with id
	if isEmailUpdated(id, user.Email, db) {
		// check if user with new email already exists
		if checkUserExistsEmail(user.Email, db) {
			return &model.ErrorResponse{
				Code:    400,
				Message: "User with email already exists",
			}
		}
	}

	errors := validateUserFields(user)

	if errors != "" {
		return &model.ErrorResponse{
			Code:    400,
			Message: "Bad request: " + errors,
		}
	}

	return nil
}

func isEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func checkUserExistsEmail(email string, db *DB) bool {

	// if real db is not being used, check mock db for user with same email
	if db.RealDB == nil {
		for _, v := range db.MockDB {
			if v.Email == email {
				return true
			}
		}
		return false
	}

	// search for user by email
	coll := db.RealDB.Database("data").Collection("users")
	filter := bson.D{{Key: "email", Value: email}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil
}

func checkUserExistsId(id *primitive.ObjectID, db *DB) bool {

	// if real db is not being used, check mock db for user with same id
	if db.RealDB == nil {
		if _, ok := db.MockDB[*id]; ok {
			return true
		}
		return false
	}

	// search for user by id
	coll := db.RealDB.Database("data").Collection("users")
	filter := bson.D{{Key: "_id", Value: *id}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil
}

func isEmailUpdated(id *primitive.ObjectID, email string, db *DB) bool {
	// check if current email is the same as the updated email
	if db.RealDB == nil {
		if user, ok := db.MockDB[*id]; ok {
			return user.Email != email
		}
		return false
	}

	// search for user by id
	coll := db.RealDB.Database("data").Collection("users")
	filter := bson.D{{Key: "_id", Value: *id}}
	var result schema.User
	err := coll.FindOne(context.Background(), filter).Decode(&result)

	return err == nil && result.Email != email
}

// use google maps api to get location from address
// HARD CODED API KEY FOR NOW
func getLocation(address *schema.Address) (*geojson.Geometry, *model.ErrorResponse) {
	addressString := address.Line1 + " " + address.City + " " + address.State + " " + address.ZipCode
	client, err := maps.NewClient(maps.WithAPIKey("AIzaSyAP5_5mbMLn34q2B_UHDM4MHsbfb82ZTZM"))
	if err != nil {
		return nil, &model.ErrorResponse{
			Code:    500,
			Message: "Failed to create google maps client",
		}
	}
	r := &maps.GeocodingRequest{
		Address: addressString,
	}
	resp, err := client.Geocode(context.Background(), r)
	if err != nil {
		return nil, &model.ErrorResponse{
			Code:    500,
			Message: "Failed to get location from address: " + addressString,
		}
	}
	lat := resp[0].Geometry.Location.Lat
	lng := resp[0].Geometry.Location.Lng
	location := geojson.Geometry{
		Type:        "Point",
		Coordinates: orb.Point{lng, lat},
	}

	return &location, nil
}

// update location field for each address
func UpdateLocations(user *schema.User) *model.ErrorResponse {
	for i := 0; i < len(user.Addresses); i++ {
		location, err := getLocation(&user.Addresses[i])
		if err != nil {
			return err
		}
		user.Addresses[i].Location = *location
	}
	return nil
}

// check for missing or invalid fields
func validateUserFields(user *schema.User) string {
	errors := ""
	v := reflect.ValueOf(*user)

	// iterate through struct fields and validate each field
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldName := v.Type().Field(i).Name

		switch fieldName {
		case "FirstName":
			if field.String() == "" {
				errors += "firstName is missing, "
			} else if len(field.String()) < 1 || len(field.String()) > 50 {
				errors += "firstName must have 1-50 characters, "
			}
		case "LastName":
			if field.String() == "" {
				errors += "lastName is missing, "
			} else if len(field.String()) < 1 || len(field.String()) > 50 {
				errors += "lastName must have 1-50 characters, "
			}
		case "Email":
			if field.String() == "" {
				errors += "email is missing, "
			} else if !isEmail(field.String()) {
				errors += "email is invalid, "
			}
		case "Password":
			if field.String() == "" {
				errors += "password is missing, "
			}
		case "Addresses":
			if field.Len() == 0 {
				errors += "addresses is missing, "
			} else {
				for j := 0; j < field.Len(); j++ {
					address := field.Index(j)
					name := address.FieldByName("Name")
					line1 := address.FieldByName("Line1")
					zipCode := address.FieldByName("ZipCode")
					city := address.FieldByName("City")
					state := address.FieldByName("State")
					country := address.FieldByName("Country")

					if name.String() == "" {
						errors += "name is missing, "
					}

					if line1.String() == "" {
						errors += "line1 is missing, "
					}

					if zipCode.String() == "" {
						errors += "zipCode is missing, "
					}

					if city.String() == "" {
						errors += "city is missing, "
					}

					if state.String() == "" {
						errors += "state is missing, "
					}

					if country.String() == "" {
						errors += "country is missing, "
					}
				}
			}
		case "PhoneNumber":
			phoneNumberPtr := v.FieldByName("PhoneNumber")
			countryCode := reflect.Indirect(phoneNumberPtr).FieldByName("CountryCode")
			number := reflect.Indirect(phoneNumberPtr).FieldByName("Number")

			if countryCode.String() == "" {
				errors += "countryCode is missing, "
			} else if len(countryCode.String()) < 1 || len(countryCode.String()) > 5 {
				errors += "countryCode must have 1-5 characters, "
			}

			if number.String() == "" {
				errors += "number is missing, "
			} else if len(number.String()) != 10 {
				errors += "number must have 10 characters, "
			}
		case "Experience":
			if field.Int() != schema.NoExperience && field.Int() != schema.SomeExperince && field.Int() != schema.MaxExperience {
				errors += "experience must be 1, 2, or 3, "
			}
		case "Printers":
			// since this is an optional field, only validate if field is not empty
			if field.Len() != 0 {
				for j := 0; j < field.Len(); j++ {
					printer := field.Index(j)
					supportedFilament := printer.FieldByName("SupportedFilament")
					dimensions := printer.FieldByName("Dimensions")

					if supportedFilament.Len() == 0 {
						errors += "supportedFilament is missing, "
					} else {
						for k := 0; k < supportedFilament.Len(); k++ {
							filament := supportedFilament.Index(k)
							if filament.String() != schema.PLA && filament.String() != schema.ABS && filament.String() != schema.TPE {
								errors += "filament must be PLA, ABS, or TPE, "
							}
						}
					}
					if dimensions.FieldByName("Height").Uint() == 0 {
						errors += "height is missing, "
					}

					if dimensions.FieldByName("Width").Uint() == 0 {
						errors += "width is missing, "
					}

					if dimensions.FieldByName("Depth").Uint() == 0 {
						errors += "depth is missing, "
					}
				}
			}
		case "AvailableFilament":
			// since this is an optional field, only validate if field is not empty
			if field.Len() != 0 {
				for j := 0; j < field.Len(); j++ {
					filament := field.Index(j)
					if filament.FieldByName("Type").String() != schema.PLA && filament.FieldByName("Type").String() != schema.ABS && filament.FieldByName("Type").String() != schema.TPE {
						errors += "filament must be PLA, ABS, or TPE, "
					}

					if filament.FieldByName("Color").String() == "" {
						errors += "color is missing, "
					}

					if filament.FieldByName("PricePerUnit").Uint() == 0 {
						errors += "pricePerUnit is missing, "
					}
				}
			}
		}
	}
	return errors
}

// Function to get all values from a map
func Values[M ~map[K]V, K comparable, V any](m M) ([]V, bool) {
	r := make([]V, 0, len(m))
	for _, v := range m {
		r = append(r, v)
	}
	return r, true
}

////////////////////
