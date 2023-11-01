package user

import (
	"testing"
	"voxeti/backend/schema"

	"github.com/paulmach/orb"
	"github.com/paulmach/orb/geojson"
	"github.com/stretchr/testify/assert"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

func TestCreateUser(t *testing.T) {
	assert := assert.New(t)

	id := primitive.NewObjectID()

	// Create DB Test Cases:
	testCases := []struct {
		name             string
		user             schema.User
		prepMongoMock    func(mt *mtest.T)
		expectedResponse schema.User
		expectedError    schema.ErrorResponse
		wantError        bool
	}{
		{
			name: "Success",
			user: schema.User{
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "johndoes@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "839 Parker St",
						Line2:   "Apt 1",
						ZipCode: "02120",
						City:    "Boston",
						State:   "MA",
						Country: "USA",
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			prepMongoMock: func(mt *mtest.T) {
				errResp := bson.D{{Key: "ok", Value: 0}}
				mt.AddMockResponses(errResp, mtest.CreateSuccessResponse())
			},
			expectedResponse: schema.User{
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "johndoes@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "839 Parker St",
						Line2:   "Apt 1",
						ZipCode: "02120",
						City:    "Boston",
						State:   "MA",
						Country: "USA",
						Location: geojson.Geometry{
							Type:        "Point",
							Coordinates: orb.Point{-71.09961489999999, 42.3278025},
						},
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			wantError: false,
		},
		{
			name: "Duplicate Email",
			user: schema.User{
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "johndoes@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "1234 Main St",
						Line2:   "Apt 1",
						ZipCode: "12345",
						City:    "New York",
						State:   "NY",
						Country: "USA",
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			prepMongoMock: func(mt *mtest.T) {
				user := schema.User{
					Id:             id,
					FirstName:      "John",
					LastName:       "Doe",
					Email:          "johndoes@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				userBSON, _ := bson.Marshal(user)
				var bsonD bson.D
				err := bson.Unmarshal(userBSON, &bsonD)
				if err != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				res := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD)

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				mt.AddMockResponses(res, end)
			},
			expectedError: schema.ErrorResponse{
				Code:    400,
				Message: "User with email already exists",
			},
			wantError: true,
		},
		{
			name: "Missing Fields",
			user: schema.User{},
			prepMongoMock: func(mt *mtest.T) {
				errResp := bson.D{{Key: "ok", Value: 0}}
				mt.AddMockResponses(errResp)
			},
			expectedError: schema.ErrorResponse{
				Code:    400,
				Message: "Bad request: firstName is missing, lastName is missing, email is missing, addresses is missing, phoneNumber is missing, experience must be 1, 2, or 3, ",
			},
			wantError: true,
		},
	}

	// Create mock DB:
	opts := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, opts)
	defer mt.Close()

	// For each test case:
	for _, testCase := range testCases {
		mt.Run(testCase.name, func(mt *mtest.T) {

			// Prep the mongo mocK:
			testCase.prepMongoMock(mt)

			user, err := CreateUser(&testCase.user, mt.Client)

			if testCase.wantError {
				if err == nil {
					assert.Fail("This test was supposed to throw an error!")
				} else {
					assert.Equal(testCase.expectedError.Code, err.Code)
					assert.Equal(testCase.expectedError.Message, err.Message)
				}
			} else {
				// assert no error
				assert.Nil(err)

				// check all fields are correct
				assert.NotNil(user.Id)
				assert.Equal(testCase.expectedResponse.FirstName, user.FirstName)
				assert.Equal(testCase.expectedResponse.LastName, user.LastName)
				assert.NotEqual(testCase.expectedResponse.Password, user.Password)
				assert.Equal(testCase.expectedResponse.Email, user.Email)
				assert.Equal(testCase.expectedResponse.SocialProvider, user.SocialProvider)
				assert.Equal(testCase.expectedResponse.Addresses, user.Addresses)
				assert.Equal(testCase.expectedResponse.PhoneNumber, user.PhoneNumber)
				assert.Equal(testCase.expectedResponse.Experience, user.Experience)
			}
		})
	}
}

func TestGetUserById(t *testing.T) {
	assert := assert.New(t)

	id := primitive.NewObjectID()

	// Create DB Test Cases:
	testCases := []struct {
		name             string
		id               primitive.ObjectID
		prepMongoMock    func(mt *mtest.T)
		expectedResponse schema.User
		expectedError    schema.ErrorResponse
		wantError        bool
	}{
		{
			name: "Success",
			id:   id,
			prepMongoMock: func(mt *mtest.T) {
				user := schema.User{
					Id:             id,
					FirstName:      "John",
					LastName:       "Doe",
					Email:          "johndoes@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				userBSON, _ := bson.Marshal(user)
				var bsonD bson.D
				err := bson.Unmarshal(userBSON, &bsonD)
				if err != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				res := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD)

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				mt.AddMockResponses(res, end)
			},
			expectedResponse: schema.User{
				Id:             id,
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "johndoes@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "1234 Main St",
						Line2:   "Apt 1",
						ZipCode: "12345",
						City:    "New York",
						State:   "NY",
						Country: "USA",
						Location: geojson.Geometry{
							Type:        "Point",
							Coordinates: orb.Point{1, 1},
						},
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			wantError: false,
		},
		{
			name: "User Not Found",
			id:   id,
			prepMongoMock: func(mt *mtest.T) {
				errResp := bson.D{{Key: "ok", Value: 0}}
				mt.AddMockResponses(errResp)
			},
			expectedError: schema.ErrorResponse{
				Code:    404,
				Message: "User not found",
			},
			wantError: true,
		},
	}

	// Create mock DB:
	opts := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, opts)
	defer mt.Close()

	// For each test case:
	for _, testCase := range testCases {
		mt.Run(testCase.name, func(mt *mtest.T) {

			// Prep the mongo mocK:
			testCase.prepMongoMock(mt)

			user, err := GetUserById(&testCase.id, mt.Client)

			if testCase.wantError {
				if err == nil {
					assert.Fail("This test was supposed to throw an error!")
				} else {
					assert.Equal(testCase.expectedError.Code, err.Code)
					assert.Equal(testCase.expectedError.Message, err.Message)
				}
			} else {
				// assert no error
				assert.Nil(err)

				// assert user is same as expected response
				assert.Equal(testCase.expectedResponse, *user)
			}
		})
	}
}

func TestGetAllUsers(t *testing.T) {
	assert := assert.New(t)

	id1 := primitive.NewObjectID()
	id2 := primitive.NewObjectID()

	// Create DB Test Cases:
	testCases := []struct {
		name             string
		page             int
		limit            int
		prepMongoMock    func(mt *mtest.T)
		expectedResponse []schema.User
		expectedError    schema.ErrorResponse
		wantError        bool
	}{
		{
			name:  "Success - Page 1, Limit 2",
			page:  1,
			limit: 2,
			prepMongoMock: func(mt *mtest.T) {
				user1 := schema.User{
					Id:             id1,
					FirstName:      "first1",
					LastName:       "last1",
					Email:          "user1@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				user2 := schema.User{
					Id:             id2,
					FirstName:      "first2",
					LastName:       "last2",
					Email:          "user2@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				user1BSON, _ := bson.Marshal(user1)
				user2BSON, _ := bson.Marshal(user2)
				var bsonD1 bson.D
				var bsonD2 bson.D
				err1 := bson.Unmarshal(user1BSON, &bsonD1)
				err2 := bson.Unmarshal(user2BSON, &bsonD2)
				if err1 != nil || err2 != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				res := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD1,
					bsonD2)

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				mt.AddMockResponses(res, end)
			},
			expectedResponse: []schema.User{
				{
					Id:             id1,
					FirstName:      "first1",
					LastName:       "last1",
					Email:          "user1@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				},
				{
					Id:             id2,
					FirstName:      "first2",
					LastName:       "last2",
					Email:          "user2@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				},
			},
			wantError: false,
		},
		{
			name:  "Success - Page 2, Limit 2",
			page:  2,
			limit: 1,
			prepMongoMock: func(mt *mtest.T) {
				user1 := schema.User{
					Id:             id1,
					FirstName:      "first1",
					LastName:       "last1",
					Email:          "user1@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				user2 := schema.User{
					Id:             id2,
					FirstName:      "first2",
					LastName:       "last2",
					Email:          "user2@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				user1BSON, _ := bson.Marshal(user1)
				user2BSON, _ := bson.Marshal(user2)
				var bsonD1 bson.D
				var bsonD2 bson.D
				err1 := bson.Unmarshal(user1BSON, &bsonD1)
				err2 := bson.Unmarshal(user2BSON, &bsonD2)
				if err1 != nil || err2 != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				res := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD1,
					bsonD2)

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				mt.AddMockResponses(res, end)
			},
			expectedResponse: []schema.User{
				{
					Id:             id2,
					FirstName:      "first2",
					LastName:       "last2",
					Email:          "user2@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				},
			},
			wantError: false,
		},
	}

	// Create mock DB:
	opts := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, opts)
	defer mt.Close()

	// For each test case:
	for _, testCase := range testCases {
		mt.Run(testCase.name, func(mt *mtest.T) {

			// Prep the mongo mocK:
			testCase.prepMongoMock(mt)

			users, err := GetAllUsers(testCase.page, testCase.limit, mt.Client)

			if testCase.wantError {
				if err == nil {
					assert.Fail("This test was supposed to throw an error!")
				} else {
					assert.Equal(testCase.expectedError.Code, err.Code)
					assert.Equal(testCase.expectedError.Message, err.Message)
				}
			} else {
				// assert no error
				assert.Nil(err)

				// assert length of users is equal to expected response
				assert.Equal(len(testCase.expectedResponse), len(users))

				// for each user in users assert that it is equal to the expected response
				for i, user := range users {
					assert.Equal(testCase.expectedResponse[i], *user)
				}
			}
		})
	}
}

func TestUpdateUserById(t *testing.T) {
	assert := assert.New(t)

	id := primitive.NewObjectID()

	// Create DB Test Cases:
	testCases := []struct {
		name             string
		id               primitive.ObjectID
		user             schema.User
		prepMongoMock    func(mt *mtest.T)
		expectedResponse schema.User
		expectedError    schema.ErrorResponse
		wantError        bool
	}{
		{
			name: "Success",
			id:   id,
			user: schema.User{
				Id:             id,
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "johndoes@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "839 Parker St",
						Line2:   "Apt 1",
						ZipCode: "02120",
						City:    "Boston",
						State:   "MA",
						Country: "USA",
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			prepMongoMock: func(mt *mtest.T) {
				user := schema.User{
					Id:             id,
					FirstName:      "Dana",
					LastName:       "White",
					Email:          "dana@gmail.com",
					Password:       "danawhite",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1738 Fetty St",
							Line2:   "Apt 1",
							ZipCode: "67890",
							City:    "Los Angeles",
							State:   "CA",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				userBSON, _ := bson.Marshal(user)
				var bsonD bson.D
				err := bson.Unmarshal(userBSON, &bsonD)
				if err != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				res := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD)

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				errResp := bson.D{{Key: "ok", Value: 0}}

				mt.AddMockResponses(res, end, errResp, bson.D{
					{Key: "ok", Value: 1},
					{Key: "value", Value: bsonD},
				})
			},
			expectedResponse: schema.User{
				Id:             id,
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "johndoes@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "839 Parker St",
						Line2:   "Apt 1",
						ZipCode: "02120",
						City:    "Boston",
						State:   "MA",
						Country: "USA",
						Location: geojson.Geometry{
							Type:        "Point",
							Coordinates: orb.Point{-71.09961489999999, 42.3278025},
						},
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			wantError: false,
		},
		{
			name: "User Not Found",
			id:   id,
			user: schema.User{
				Id:             id,
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "johndoes@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "1234 Main St",
						Line2:   "Apt 1",
						ZipCode: "12345",
						City:    "New York",
						State:   "NY",
						Country: "USA",
						Location: geojson.Geometry{
							Type:        "Point",
							Coordinates: orb.Point{1, 1},
						},
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			prepMongoMock: func(mt *mtest.T) {
				errResp := bson.D{{Key: "ok", Value: 0}}
				mt.AddMockResponses(errResp)
			},
			expectedError: schema.ErrorResponse{
				Code:    404,
				Message: "User not found",
			},
			wantError: true,
		},
		{
			name: "User With Email Already Exists",
			id:   id,
			user: schema.User{
				Id:             id,
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "kd35@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "839 Parker St",
						Line2:   "Apt 1",
						ZipCode: "02120",
						City:    "Boston",
						State:   "MA",
						Country: "USA",
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			prepMongoMock: func(mt *mtest.T) {
				user1 := schema.User{
					Id:             id,
					FirstName:      "Dana",
					LastName:       "White",
					Email:          "dana22@gmail.com",
					Password:       "danawhite",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1738 Fetty St",
							Line2:   "Apt 1",
							ZipCode: "67890",
							City:    "Los Angeles",
							State:   "CA",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				user2 := schema.User{
					Id:             primitive.NewObjectID(),
					FirstName:      "Kevin",
					LastName:       "Durant",
					Email:          "kd35@gmail.com",
					Password:       "iamkevindurant",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "35 Oklahoma St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "Phoenix",
							State:   "AZ",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				user1BSON, _ := bson.Marshal(user1)
				user2BSON, _ := bson.Marshal(user2)
				var bsonD1 bson.D
				var bsonD2 bson.D
				err1 := bson.Unmarshal(user1BSON, &bsonD1)
				err2 := bson.Unmarshal(user2BSON, &bsonD2)
				if err1 != nil || err2 != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				resp1 := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD1)

				resp2 := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD2)

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				mt.AddMockResponses(resp1, end, resp1, end, resp2, end)
			},
			expectedError: schema.ErrorResponse{
				Code:    400,
				Message: "User with email already exists",
			},
			wantError: true,
		},
		{
			name: "Missing Fields",
			id:   id,
			user: schema.User{},
			prepMongoMock: func(mt *mtest.T) {
				user := schema.User{
					Id:             id,
					FirstName:      "Dana",
					LastName:       "White",
					Email:          "dana22@gmail.com",
					Password:       "danawhite",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1738 Fetty St",
							Line2:   "Apt 1",
							ZipCode: "67890",
							City:    "Los Angeles",
							State:   "CA",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				userBSON, _ := bson.Marshal(user)
				var bsonD bson.D
				err := bson.Unmarshal(userBSON, &bsonD)
				if err != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				resp1 := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD)

				errResp := bson.D{{Key: "ok", Value: 0}}

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				mt.AddMockResponses(resp1, end, errResp)
			},
			expectedError: schema.ErrorResponse{
				Code:    400,
				Message: "Bad request: firstName is missing, lastName is missing, email is missing, addresses is missing, phoneNumber is missing, experience must be 1, 2, or 3, ",
			},
			wantError: true,
		},
	}

	// Create mock DB:
	opts := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, opts)
	defer mt.Close()

	// For each test case:
	for _, testCase := range testCases {
		mt.Run(testCase.name, func(mt *mtest.T) {

			// Prep the mongo mocK:
			testCase.prepMongoMock(mt)

			user, err := UpdateUserById(&testCase.id, &testCase.user, mt.Client)

			if testCase.wantError {
				if err == nil {
					assert.Fail("This test was supposed to throw an error!")
				} else {
					assert.Equal(testCase.expectedError.Code, err.Code)
					assert.Equal(testCase.expectedError.Message, err.Message)
				}
			} else {
				// assert no error
				assert.Nil(err)

				// assert user is same as expected response
				assert.Equal(testCase.expectedResponse, *user)
			}
		})
	}
}

func TestDeleteUserById(t *testing.T) {
	assert := assert.New(t)

	id := primitive.NewObjectID()

	// Create DB Test Cases:
	testCases := []struct {
		name             string
		id               primitive.ObjectID
		prepMongoMock    func(mt *mtest.T)
		expectedResponse schema.User
		expectedError    schema.ErrorResponse
		wantError        bool
	}{
		{
			name: "Success",
			id:   id,
			prepMongoMock: func(mt *mtest.T) {
				user := schema.User{
					Id:             id,
					FirstName:      "John",
					LastName:       "Doe",
					Email:          "johndoes@gmail.com",
					Password:       "password1",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1234 Main St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "New York",
							State:   "NY",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				userBSON, _ := bson.Marshal(user)
				var bsonD bson.D
				err := bson.Unmarshal(userBSON, &bsonD)
				if err != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				res := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD)

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				mt.AddMockResponses(res, end, bson.D{{Key: "ok", Value: 1}, {Key: "acknowledged", Value: true}, {Key: "n", Value: 1}})
			},
			expectedResponse: schema.User{
				Id:             id,
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "johndoes@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "1234 Main St",
						Line2:   "Apt 1",
						ZipCode: "12345",
						City:    "New York",
						State:   "NY",
						Country: "USA",
						Location: geojson.Geometry{
							Type:        "Point",
							Coordinates: orb.Point{1, 1},
						},
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			wantError: false,
		},
		{
			name: "User Not Found",
			id:   id,
			prepMongoMock: func(mt *mtest.T) {
				errResp := bson.D{{Key: "ok", Value: 0}}
				mt.AddMockResponses(errResp)
			},
			expectedError: schema.ErrorResponse{
				Code:    404,
				Message: "User not found",
			},
			wantError: true,
		},
	}

	// Create mock DB:
	opts := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, opts)
	defer mt.Close()

	// For each test case:
	for _, testCase := range testCases {
		mt.Run(testCase.name, func(mt *mtest.T) {

			// Prep the mongo mocK:
			testCase.prepMongoMock(mt)

			user, err := DeleteUserById(&testCase.id, mt.Client)

			if testCase.wantError {
				if err == nil {
					assert.Fail("This test was supposed to throw an error!")
				} else {
					assert.Equal(testCase.expectedError.Code, err.Code)
					assert.Equal(testCase.expectedError.Message, err.Message)
				}
			} else {
				// assert no error
				assert.Nil(err)

				// assert user is same as expected response
				assert.Equal(testCase.expectedResponse, *user)
			}
		})
	}
}

func TestPatchUserById(t *testing.T) {
	assert := assert.New(t)

	id := primitive.NewObjectID()

	// Create DB Test Cases:
	testCases := []struct {
		name             string
		id               primitive.ObjectID
		user             schema.User
		prepMongoMock    func(mt *mtest.T)
		expectedResponse schema.User
		expectedError    schema.ErrorResponse
		wantError        bool
	}{
		{
			name: "Success",
			id:   id,
			user: schema.User{
				Id:       id,
				LastName: "Brown",
			},
			prepMongoMock: func(mt *mtest.T) {
				user := schema.User{
					Id:             id,
					FirstName:      "Dana",
					LastName:       "White",
					Email:          "dana@gmail.com",
					Password:       "danawhite",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1738 Fetty St",
							Line2:   "Apt 1",
							ZipCode: "67890",
							City:    "Los Angeles",
							State:   "CA",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				userBSON, _ := bson.Marshal(user)
				var bsonD bson.D
				err := bson.Unmarshal(userBSON, &bsonD)
				if err != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				bsonE := bson.E{Key: "n", Value: 1}

				updateRes := mtest.CreateSuccessResponse(bsonE)

				findRes := mtest.CreateCursorResponse(1, "data.users", mtest.FirstBatch, bsonD)
				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				errResp := bson.D{{Key: "ok", Value: 0}}

				mt.AddMockResponses(errResp, updateRes, findRes, end, bson.D{
					{Key: "ok", Value: 1},
					{Key: "value", Value: bsonD},
				})
			},
			expectedResponse: schema.User{
				Id:             id,
				FirstName:      "Dana",
				LastName:       "Brown",
				Email:          "dana@gmail.com",
				Password:       "danawhite",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "1738 Fetty St",
						Line2:   "Apt 1",
						ZipCode: "67890",
						City:    "Los Angeles",
						State:   "CA",
						Country: "USA",
						Location: geojson.Geometry{
							Type:        "Point",
							Coordinates: orb.Point{1, 1},
						},
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			wantError: false,
		},
		{
			name: "User Not Found",
			id:   id,
			user: schema.User{
				Id:             id,
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "johndoes@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "1234 Main St",
						Line2:   "Apt 1",
						ZipCode: "12345",
						City:    "New York",
						State:   "NY",
						Country: "USA",
						Location: geojson.Geometry{
							Type:        "Point",
							Coordinates: orb.Point{1, 1},
						},
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			prepMongoMock: func(mt *mtest.T) {
				errResp := bson.D{{Key: "ok", Value: 0}}
				mt.AddMockResponses(errResp)
			},
			expectedError: schema.ErrorResponse{
				Code:    404,
				Message: "User not found",
			},
			wantError: true,
		},
		{
			name: "User With Email Already Exists",
			id:   id,
			user: schema.User{
				Id:             id,
				FirstName:      "John",
				LastName:       "Doe",
				Email:          "kd35@gmail.com",
				Password:       "password1",
				SocialProvider: "NONE",
				Addresses: []schema.Address{
					{
						Name:    "Home",
						Line1:   "839 Parker St",
						Line2:   "Apt 1",
						ZipCode: "02120",
						City:    "Boston",
						State:   "MA",
						Country: "USA",
					},
				},
				PhoneNumber: &schema.PhoneNumber{
					CountryCode: "1",
					Number:      "1234567890",
				},
				Experience: 1,
				Printers: []schema.Printer{
					{
						SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
						Dimensions: schema.Dimensions{
							Height: 10,
							Width:  10,
							Depth:  10,
						},
					},
				},
				AvailableFilament: []schema.Filament{
					{
						Type:         "PLA",
						Color:        "Red",
						PricePerUnit: 10,
					},
					{
						Type:         "ABS",
						Color:        "Blue",
						PricePerUnit: 10,
					},
				},
			},
			prepMongoMock: func(mt *mtest.T) {
				user1 := schema.User{
					Id:             id,
					FirstName:      "Dana",
					LastName:       "White",
					Email:          "dana22@gmail.com",
					Password:       "danawhite",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1738 Fetty St",
							Line2:   "Apt 1",
							ZipCode: "67890",
							City:    "Los Angeles",
							State:   "CA",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				user2 := schema.User{
					Id:             primitive.NewObjectID(),
					FirstName:      "Kevin",
					LastName:       "Durant",
					Email:          "kd35@gmail.com",
					Password:       "iamkevindurant",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "35 Oklahoma St",
							Line2:   "Apt 1",
							ZipCode: "12345",
							City:    "Phoenix",
							State:   "AZ",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				user1BSON, _ := bson.Marshal(user1)
				user2BSON, _ := bson.Marshal(user2)
				var bsonD1 bson.D
				var bsonD2 bson.D
				err1 := bson.Unmarshal(user1BSON, &bsonD1)
				err2 := bson.Unmarshal(user2BSON, &bsonD2)
				if err1 != nil || err2 != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				resp1 := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD1)

				resp2 := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD2)

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				mt.AddMockResponses(resp1, end, resp1, end, resp2, end)
			},
			expectedError: schema.ErrorResponse{
				Code:    400,
				Message: "User with email already exists",
			},
			wantError: true,
		},
		{
			name: "Missing Fields",
			id:   id,
			user: schema.User{},
			prepMongoMock: func(mt *mtest.T) {
				user := schema.User{
					Id:             id,
					FirstName:      "Dana",
					LastName:       "White",
					Email:          "dana22@gmail.com",
					Password:       "danawhite",
					SocialProvider: "NONE",
					Addresses: []schema.Address{
						{
							Name:    "Home",
							Line1:   "1738 Fetty St",
							Line2:   "Apt 1",
							ZipCode: "67890",
							City:    "Los Angeles",
							State:   "CA",
							Country: "USA",
							Location: geojson.Geometry{
								Type:        "Point",
								Coordinates: orb.Point{1, 1},
							},
						},
					},
					PhoneNumber: &schema.PhoneNumber{
						CountryCode: "1",
						Number:      "1234567890",
					},
					Experience: 1,
					Printers: []schema.Printer{
						{
							SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
							Dimensions: schema.Dimensions{
								Height: 10,
								Width:  10,
								Depth:  10,
							},
						},
					},
					AvailableFilament: []schema.Filament{
						{
							Type:         "PLA",
							Color:        "Red",
							PricePerUnit: 10,
						},
						{
							Type:         "ABS",
							Color:        "Blue",
							PricePerUnit: 10,
						},
					},
				}

				userBSON, _ := bson.Marshal(user)
				var bsonD bson.D
				err := bson.Unmarshal(userBSON, &bsonD)
				if err != nil {
					assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
				}

				resp1 := mtest.CreateCursorResponse(
					1,
					"data.users",
					mtest.FirstBatch,
					bsonD)

				errResp := bson.D{{Key: "ok", Value: 0}}

				end := mtest.CreateCursorResponse(
					0,
					"data.users",
					mtest.NextBatch)

				mt.AddMockResponses(resp1, end, errResp)
			},
			expectedError: schema.ErrorResponse{
				Code:    400,
				Message: "Bad request: firstName is missing, lastName is missing, email is missing, addresses is missing, phoneNumber is missing, experience must be 1, 2, or 3, ",
			},
			wantError: true,
		},
	}

	// Create mock DB:
	opts := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, opts)
	defer mt.Close()

	// For each test case:
	for _, testCase := range testCases {
		mt.Run(testCase.name, func(mt *mtest.T) {

			// Prep the mongo mocK:
			testCase.prepMongoMock(mt)

			user, err := PatchUserById(&testCase.id, &testCase.user, mt.Client)

			if testCase.wantError {
				if err == nil {
					assert.Fail("This test was supposed to throw an error!")
				} else {
					assert.Equal(testCase.expectedError.Code, err.Code)
					assert.Equal(testCase.expectedError.Message, err.Message)
				}
			} else {
				// assert no error
				assert.Nil(err)

				// assert user is same as expected response
				assert.Equal(testCase.expectedResponse, *user)
			}
		})
	}
}
