package registration

import (
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"github.com/labstack/echo/v4"
)

var (
	validUser string = `{
		"username": "test",
		"firstName": "John",
		"lastName": "Doe",
		"email": "test@gmail.com",
		"birthday": "1999-01-01",
		"phoneNumber": {
			"countryCode": "1",
			"number": "4444455555"
		},
		"userType": "Designer"
	}`

	invalidUser string = `{
		"firstName": "Invalid",
		"lastName": "User",
		"email": "missing.fields@gmail.com"
		"birthday": "1999-01-01",
		"phoneNumber": {
			"number": "4444455555"
		},
		"userType": "Designer"
	}`
)

func TestCreateUser(t *testing.T) {
	e := echo.New()

	// configure logger and database
	spinnerSuccess, _ := pterm.DefaultSpinner.Start()
	logLevel := pterm.LogLevelInfo
	logger := pterm.DefaultLogger.WithLevel(logLevel)
	dbClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://administrator:Welcome1234@127.0.0.1:27017"))
	if err != nil || dbClient.Ping(context.TODO(), readpref.Primary()) != nil {
		spinnerSuccess.Fail("Failed to connect to database")
		os.Exit(1)
	}

	// define request, recorder, context for invalid user
	invalidReq := httptest.NewRequest(http.MethodPost, "/user/create", strings.NewReader(invalidUser))
	invalidReq.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	invalidRec := httptest.NewRecorder()
	invalidC := e.NewContext(invalidReq, invalidRec)

	// make invalid request
	invalidUser, invalidErr := CreateUser(invalidC, dbClient, logger)

	// check for 400 status code
	assert.Equal(t, invalidErr.Code, 400)

	// check response body
	assert.Nil(t, invalidUser, "User should be nil")

	// define new request, recorder, context for valid user
	validReq := httptest.NewRequest(http.MethodPost, "/user/create", strings.NewReader(validUser))
	validReq.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	validRec := httptest.NewRecorder()
	c := e.NewContext(validReq, validRec)

	// make valid request
	validUser, validUserErr := CreateUser(c, dbClient, logger)

	// check for any errors
	assert.Nil(t, validUserErr, "Error should be nil")

	// check response body
	assert.Equal(t, validUser.User.Username, "test")
	assert.Equal(t, validUser.User.FirstName, "John")
	assert.Equal(t, validUser.User.LastName, "Doe")
	assert.Equal(t, validUser.User.Email, "test@gmail.com")
	assert.Equal(t, validUser.User.Birthday, "1999-01-01")
	assert.Equal(t, validUser.User.PhoneNumber.CountryCode, "1")
	assert.Equal(t, validUser.User.PhoneNumber.Number, "4444455555")
	assert.Equal(t, validUser.User.UserType, "Designer")

	// delete user from database by id
	coll := dbClient.Database("data").Collection("users")
	filter := bson.M{"_id": validUser.Id}
	_, err = coll.DeleteOne(context.TODO(), filter)
	if err != nil {
		panic(err)
	}

	if err = dbClient.Disconnect(context.TODO()); err != nil {
		panic(err)
	}
}
