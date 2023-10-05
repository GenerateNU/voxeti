package user

import (
	"testing"
	"voxeti/backend/model"
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

	duplicateUser schema.User = schema.User{
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

	invalidUser schema.User = schema.User{
		FirstName: "John",
		LastName:  "Doe",
		Email:     "badEmail",
		Password:  "password",
	}

	dbClient model.DB = model.DB{
		RealDB: nil,
		MockDB: make(map[primitive.ObjectID]*schema.User),
	}
)

func TestCreateUser(t *testing.T) {

	// test invalid user
	id, err := CreateUser(&invalidUser, &dbClient)
	assert.NotNil(t, err)
	assert.Nil(t, id)

	// test error code and message
	assert.Equal(t, err.Code, 400)
	assert.Equal(t, "Bad request: email is invalid, areaCode is missing, number is missing, ", err.Message)

	// create 3 valid users
	id1, err1 := CreateUser(&validUser1, &dbClient)
	id2, err2 := CreateUser(&validUser2, &dbClient)
	id3, err3 := CreateUser(&validUser3, &dbClient)

	// test that no errors were returned
	assert.Nil(t, err1)
	assert.Nil(t, err2)
	assert.Nil(t, err3)

	// test that ids are unique
	assert.NotEqual(t, id1, id2)
	assert.NotEqual(t, id1, id3)
	assert.NotEqual(t, id2, id3)

	// retrieve users from mock db
	user1 := dbClient.MockDB[*id1]
	user2 := dbClient.MockDB[*id2]
	user3 := dbClient.MockDB[*id3]

	// print all 3 users
	t.Log(user1)
	t.Log(user2)
	t.Log(user3)

	// try to create duplicate user and test that error is returned
	id4, err4 := CreateUser(&duplicateUser, &dbClient)
	assert.NotNil(t, err4)
	assert.Nil(t, id4)

	// test error code and message
	assert.Equal(t, err4.Code, 400)
	assert.Equal(t, "Bad request: user with email already exists", err4.Message)
}
