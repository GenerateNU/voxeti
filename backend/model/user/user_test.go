package user

import (
	"os"
	"testing"
	"voxeti/backend/schema"

	"github.com/joho/godotenv"
	"github.com/paulmach/orb/geojson"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	validUser1 schema.User = schema.User{
		FirstName: "John",
		LastName:  "Doe",
		Email:     "johndoe@gmail.com",
		Password:  "johndoe12",
		Addresses: []schema.Address{
			{
				Name:     "Steast",
				Line1:    "11 Speare Pl",
				Line2:    "temp",
				ZipCode:  "02115",
				City:     "Boston",
				State:    "MA",
				Country:  "United States",
				Location: geojson.Geometry{},
			},
			{
				Name:     "Home",
				Line1:    "839 Parker St",
				Line2:    "Apartment 1",
				ZipCode:  "02120",
				City:     "Boston",
				State:    "MA",
				Country:  "United States",
				Location: geojson.Geometry{},
			},
		},
		PhoneNumber: &schema.PhoneNumber{
			CountryCode: "+1",
			Number:      "9191238686",
		},
		Experience: schema.SomeExperince,
		Printers: []schema.Printer{
			{
				SupportedFilament: []schema.FilamentType{schema.PLA, schema.TPE},
				Dimensions: schema.Dimensions{
					Height: 10,
					Width:  10,
					Depth:  10,
				},
			},
			{
				SupportedFilament: []schema.FilamentType{schema.PLA, schema.ABS},
				Dimensions: schema.Dimensions{
					Height: 20,
					Width:  20,
					Depth:  20,
				},
			},
		},
		AvailableFilament: []schema.Filament{
			{
				Type:         schema.ABS,
				Color:        "blue",
				PricePerUnit: 5,
			},
			{
				Type:         schema.TPE,
				Color:        "green",
				PricePerUnit: 7,
			},
		},
	}

	validUser2 schema.User = schema.User{
		FirstName: "Jane",
		LastName:  "Doe",
		Email:     "janedoe@gmail.com",
		Password:  "9janedoe",
		Addresses: []schema.Address{
			{
				Name:     "Steast",
				Line1:    "11 Speare Pl",
				Line2:    "temp",
				ZipCode:  "02115",
				City:     "Boston",
				State:    "MA",
				Country:  "United States",
				Location: geojson.Geometry{},
			},
			{
				Name:     "Home",
				Line1:    "839 Parker St",
				Line2:    "Apartment 1",
				ZipCode:  "02120",
				City:     "Boston",
				State:    "MA",
				Country:  "United States",
				Location: geojson.Geometry{},
			},
		},
		PhoneNumber: &schema.PhoneNumber{
			CountryCode: "+1",
			Number:      "9191238686",
		},
		Experience: schema.SomeExperince,
		Printers: []schema.Printer{
			{
				SupportedFilament: []schema.FilamentType{schema.PLA, schema.TPE},
				Dimensions: schema.Dimensions{
					Height: 10,
					Width:  10,
					Depth:  10,
				},
			},
			{
				SupportedFilament: []schema.FilamentType{schema.PLA, schema.ABS},
				Dimensions: schema.Dimensions{
					Height: 20,
					Width:  20,
					Depth:  20,
				},
			},
		},
		AvailableFilament: []schema.Filament{
			{
				Type:         schema.ABS,
				Color:        "blue",
				PricePerUnit: 5,
			},
			{
				Type:         schema.TPE,
				Color:        "green",
				PricePerUnit: 7,
			},
		},
	}

	validUser3 schema.User = schema.User{
		FirstName: "Joseph",
		LastName:  "Person",
		Email:     "josephperson@gmail.com",
		Password:  "josephjoseph",
		Addresses: []schema.Address{
			{
				Name:     "Steast",
				Line1:    "11 Speare Pl",
				Line2:    "temp",
				ZipCode:  "02115",
				City:     "Boston",
				State:    "MA",
				Country:  "United States",
				Location: geojson.Geometry{},
			},
			{
				Name:     "Home",
				Line1:    "839 Parker St",
				Line2:    "Apartment 1",
				ZipCode:  "02120",
				City:     "Boston",
				State:    "MA",
				Country:  "United States",
				Location: geojson.Geometry{},
			},
		},
		PhoneNumber: &schema.PhoneNumber{
			CountryCode: "+1",
			Number:      "9191238686",
		},
		Experience: schema.SomeExperince,
		Printers: []schema.Printer{
			{
				SupportedFilament: []schema.FilamentType{schema.PLA, schema.TPE},
				Dimensions: schema.Dimensions{
					Height: 10,
					Width:  10,
					Depth:  10,
				},
			},
			{
				SupportedFilament: []schema.FilamentType{schema.PLA, schema.ABS},
				Dimensions: schema.Dimensions{
					Height: 20,
					Width:  20,
					Depth:  20,
				},
			},
		},
		AvailableFilament: []schema.Filament{
			{
				Type:         schema.ABS,
				Color:        "blue",
				PricePerUnit: 5,
			},
			{
				Type:         schema.TPE,
				Color:        "green",
				PricePerUnit: 7,
			},
		},
	}

	emptyUser schema.User = schema.User{
		FirstName:         "",
		LastName:          "",
		Email:             "",
		Password:          "",
		Addresses:         []schema.Address{{}},
		PhoneNumber:       &schema.PhoneNumber{},
		Experience:        schema.SomeExperince,
		Printers:          []schema.Printer{{}},
		AvailableFilament: []schema.Filament{{}},
	}

	invalidUser schema.User = schema.User{
		FirstName: "123456789012345678901234567890123456789012345678901",
		LastName:  "123456789012345678901234567890123456789012345678901",
		Email:     "bademail",
		Password:  "",
		Addresses: []schema.Address{{}},
		PhoneNumber: &schema.PhoneNumber{
			CountryCode: "123456",
			Number:      "1",
		},
		Experience: 9,
		Printers: []schema.Printer{{
			SupportedFilament: []schema.FilamentType{"badfilament"},
			Dimensions:        schema.Dimensions{},
		}},
		AvailableFilament: []schema.Filament{{
			Type:         "badfilament",
			Color:        "",
			PricePerUnit: 0,
		}},
	}
)

func TestCreateUser(t *testing.T) {
	// load environment variables
	envErr := godotenv.Load("../../../.env")
	if envErr != nil || os.Getenv("SESSION_KEY") == "" || os.Getenv("G_MAPS_API_KEY") == "" {
		os.Exit(1)
	}

	var dbClient DB = DB{
		RealDB: nil,
		MockDB: make(map[primitive.ObjectID]*schema.User),
	}

	// create empty user
	// check error code and message and nil id
	id, err := CreateUser(&emptyUser, &dbClient)
	assert.Equal(t, 400, err.Code)
	assert.Equal(t, "Bad request: firstName is missing, lastName is missing, email is missing, password is missing, name is missing, line1 is missing, zipCode is missing, city is missing, state is missing, country is missing, countryCode is missing, number is missing, supportedFilament is missing, height is missing, width is missing, depth is missing, filament must be PLA, ABS, or TPE, color is missing, pricePerUnit is missing, ", err.Message)
	assert.Nil(t, id)

	// create invalid user
	// check error code and message and nil id
	id, err = CreateUser(&invalidUser, &dbClient)
	assert.Equal(t, 400, err.Code)
	assert.Equal(t, "Bad request: firstName must have 1-50 characters, lastName must have 1-50 characters, email is invalid, password is missing, name is missing, line1 is missing, zipCode is missing, city is missing, state is missing, country is missing, countryCode must have 1-5 characters, number must have 10 characters, experience must be 1, 2, or 3, filament must be PLA, ABS, or TPE, height is missing, width is missing, depth is missing, filament must be PLA, ABS, or TPE, color is missing, pricePerUnit is missing, ", err.Message)
	assert.Nil(t, id)

	// create valid user and check no errors returned
	id, err = CreateUser(&validUser1, &dbClient)
	assert.Nil(t, err)

	// retrieve user from mock db
	// check user is equal to validUser1
	user := dbClient.MockDB[*id]
	assert.Equal(t, user, &validUser1)

	// make repeated call to create user
	// check error code and message and nil id
	id, err = CreateUser(&validUser1, &dbClient)
	assert.Equal(t, 400, err.Code)
	assert.Equal(t, "User with email already exists", err.Message)
	assert.Nil(t, id)
}

func TestGetUserById(t *testing.T) {

	var dbClient DB = DB{
		RealDB: nil,
		MockDB: make(map[primitive.ObjectID]*schema.User),
	}

	// get non-existent user
	// check error code and message and nil user
	user, err := GetUserById(&primitive.ObjectID{}, &dbClient)
	assert.Equal(t, 404, err.Code)
	assert.Equal(t, "User not found", err.Message)
	assert.Nil(t, user)

	id, _ := CreateUser(&validUser1, &dbClient)

	// check that no errors were returned and user is equal to validUser1
	user, err = GetUserById(id, &dbClient)
	assert.Nil(t, err)
	assert.Equal(t, user, &validUser1)

	// check repeated call does not throw error and user is still validUser1
	user, err = GetUserById(id, &dbClient)
	assert.Nil(t, err)
	assert.Equal(t, &validUser1, user)
}

func TestUpdateUserById(t *testing.T) {

	var dbClient DB = DB{
		RealDB: nil,
		MockDB: make(map[primitive.ObjectID]*schema.User),
	}

	// update non-existent user
	// check error code and message and nil id
	updatedId, err := UpdateUserById(&primitive.ObjectID{}, &validUser1, &dbClient)
	assert.Equal(t, 404, err.Code)
	assert.Equal(t, "User not found", err.Message)
	assert.Nil(t, updatedId)

	id, _ := CreateUser(&validUser1, &dbClient)
	CreateUser(&validUser2, &dbClient)

	// update user with empty user
	// check error code and message and nil id
	updatedId, err = UpdateUserById(id, &emptyUser, &dbClient)
	assert.Equal(t, 400, err.Code)
	assert.Equal(t, "Bad request: firstName is missing, lastName is missing, email is missing, password is missing, name is missing, line1 is missing, zipCode is missing, city is missing, state is missing, country is missing, countryCode is missing, number is missing, supportedFilament is missing, height is missing, width is missing, depth is missing, filament must be PLA, ABS, or TPE, color is missing, pricePerUnit is missing, ", err.Message)
	assert.Nil(t, updatedId)

	// update user with invalid user
	// check error code and message and nil id
	updatedId, err = UpdateUserById(id, &invalidUser, &dbClient)
	assert.Equal(t, 400, err.Code)
	assert.Equal(t, "Bad request: firstName must have 1-50 characters, lastName must have 1-50 characters, email is invalid, password is missing, name is missing, line1 is missing, zipCode is missing, city is missing, state is missing, country is missing, countryCode must have 1-5 characters, number must have 10 characters, experience must be 1, 2, or 3, filament must be PLA, ABS, or TPE, height is missing, width is missing, depth is missing, filament must be PLA, ABS, or TPE, color is missing, pricePerUnit is missing, ", err.Message)
	assert.Nil(t, updatedId)

	// update user with email that already exists in db
	// check error code and message and nil id
	updatedId, err = UpdateUserById(id, &validUser2, &dbClient)
	assert.Equal(t, 400, err.Code)
	assert.Equal(t, "User with email already exists", err.Message)
	assert.Nil(t, updatedId)

	// update user with valid request
	// check that no errors were returned and id is same as id of updated user
	updatedId, err = UpdateUserById(id, &validUser3, &dbClient)
	assert.Nil(t, err)
	assert.Equal(t, id, updatedId)

	// retrieve user from mock db and check that it is equal to validUser3
	user := dbClient.MockDB[*updatedId]
	assert.Equal(t, user, &validUser3)

	// check repeated update does not throw error and user is still validUser3
	updatedId, err = UpdateUserById(id, &validUser3, &dbClient)
	user = dbClient.MockDB[*updatedId]
	assert.Nil(t, err)
	assert.Equal(t, &validUser3, user)
}
