package user

import (
	"testing"
	"voxeti/backend/schema"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	validUser1 schema.User = schema.User{
		FirstName: "John",
		LastName:  "Doe",
		Email:     "john.doe@gmail.com",
		Password:  "password",
		PhoneNumber: schema.PhoneNumber{
			AreaCode: "+1",
			Number:   "1111111111",
		},
		Experience: schema.NoExperience,
	}

	validUser2 schema.User = schema.User{
		FirstName: "Jane",
		LastName:  "Doe",
		Email:     "jane.doe@gmail.com",
		Password:  "password",
		PhoneNumber: schema.PhoneNumber{
			AreaCode: "+1",
			Number:   "2222222222",
		},
		Experience: schema.SomeExperince,
	}

	validUser3 schema.User = schema.User{
		FirstName: "Alex",
		LastName:  "Doe",
		Email:     "alex.doe@gmail.com",
		Password:  "password",
		PhoneNumber: schema.PhoneNumber{
			AreaCode: "+1",
			Number:   "3333333333",
		},
		Experience: schema.MaxExperience,
	}

	invalidUser schema.User = schema.User{
		FirstName: "John",
		LastName:  "Doe",
		Email:     "badEmail",
		Password:  "password",
	}
)

func TestCreateUser(t *testing.T) {

	var dbClient DB = DB{
		RealDB: nil,
		MockDB: make(map[primitive.ObjectID]*schema.User),
	}

	// create invalid user
	// check error code and message and nil id
	id, err := CreateUser(&invalidUser, &dbClient)
	assert.Equal(t, 400, err.Code)
	assert.Equal(t, "Bad request: email is invalid, areaCode is missing, number is missing, experience must be 1, 2, or 3, ", err.Message)
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

	// update user with invalid request
	// check error code and message and nil id
	updatedId, err = UpdateUserById(id, &invalidUser, &dbClient)
	assert.Equal(t, 400, err.Code)
	assert.Equal(t, "Bad request: email is invalid, areaCode is missing, number is missing, experience must be 1, 2, or 3, ", err.Message)
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
