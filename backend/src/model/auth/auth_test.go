package auth

import (
	"bytes"
	"context"
	"encoding/json"
	// "fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"
	"voxeti/backend/src/model"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func TestLogin(t *testing.T) {
	// configure environment variable
	t.Setenv("DATABASE_NAME", "data")

	// mocking mongodb client
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	dbClient, _ := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://administrator:Welcome1234@127.0.0.1:27017"))

	// insert test user if currently doesn't exist
	usersCollection := dbClient.Database(os.Getenv("DATABASE_NAME")).Collection("users")
	filter := bson.D{{Key: "email", Value: "user1@example.com"}}

	var user model.User
	if err := usersCollection.FindOne(context.Background(), filter).Decode(&user); err != nil {
		newUser := model.User{Email: "user1@example.com", Password: "$2a$10$yQMzszWR14B7a8WmQh4GT.gf4bf/x1ntXpX0kobFKIW8kOHQ2DOji"}
		_, err = usersCollection.InsertOne(context.TODO(), newUser)
		if err != nil {
			t.Fatal("Failed adding user to database during test setup.")
		}
	}

	// mocking the echo context
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	res := httptest.NewRecorder()
	context := e.NewContext(req, res)
	// initializing cookie store
	var store = sessions.NewCookieStore([]byte("test"))

	// Invalid Username
	invalidUserCredentials := model.Credentials{}
	invalidUserCredentials.Email = "wrong"
	invalidUserCredentials.Password = "password1"
	_, invalid_user_err := Login(context, store, dbClient, invalidUserCredentials)

	// Invalid Password
	invalidPasswordCredentials := model.Credentials{}
	invalidPasswordCredentials.Email = "user1@example.com"
	invalidPasswordCredentials.Password = "wrong"
	_, invalid_password_err := Login(context, store, dbClient, invalidPasswordCredentials)

	// Valid Login
	validCredentials := model.Credentials{}
	validCredentials.Email = "user1@example.com"
	validCredentials.Password = "password1"
	valid_response, err_null := Login(context, store, dbClient, validCredentials)

	// 1. Invalid username should throw appropriate error
	if invalid_user_err.Code != 400 || invalid_user_err.Message != "User does not exist!" {
		t.Fatalf(`Invalid username input was not caught. Error code: %d. Error message: %q`, invalid_user_err.Code, invalid_user_err.Message)
	}

	// 2. Invalid password should throw appropriate error
	if invalid_password_err.Code != 400 || invalid_password_err.Message != "Invalid Password" {
		t.Fatal("Invalid password input was not caught.")
	}

	// 3. Valid credentials should login user
	if err_null.Code != 0 || err_null.Message != "" || valid_response["csrf_token"] == nil || valid_response["user"] == nil {
		t.Fatal("Valid username and password was not accepted.")
	}
}

func TestCreateUserSession(t *testing.T) {
	// mocking the echo context
	e := echo.New()

	req := httptest.NewRequest(http.MethodPost, "/", nil)
	res := httptest.NewRecorder()
	c := e.NewContext(req, res)

	// initializing empty cookie store
	var store = sessions.NewCookieStore([]byte("test"))

	csrfToken, _ := CreateUserSession(c, store, "123")

	// 1. There is a csrfToken returned:
	if csrfToken == "" {
		t.Fatal("CreateUserSession failed to generate a csrf_token!")
	}

	// 2. There is a session created inside of the store that includes a CSRFToken and userId: 123
	session, _ := store.Get(c.Request(), "voxeti-session")

	if session.Values["userId"] != "123" || session.Values["csrfToken"] == nil {
		t.Fatal("CreateUserSession failed to create a valid user session!")
	}
}

func TestInvalidateUserSession(t *testing.T) {
	// mocking the echo context
	e := echo.New()

	req := httptest.NewRequest(http.MethodPost, "/", nil)
	res := httptest.NewRecorder()
	c := e.NewContext(req, res)

	// initializing cookie store
	var store = sessions.NewCookieStore([]byte("test"))
	CreateUserSession(c, store, "123")

	// 1. Check to see if a cookie exists
	session, _ := store.Get(c.Request(), "voxeti-session")
	if session.Values["userId"] != "123" || session.Values["csrfToken"] == nil {
		t.Fatal("Cannot complete test, dependent method, CreateUserSession, has failed!")
	}

	// invalidate the user session
	InvalidateUserSession(c, store)

	// 2. Ensure the cookie is new when created and that no userId and CSRF token exists
	session, _ = store.Get(c.Request(), "voxeti-session")
	if session.Values["userId"] != nil || session.Values["csrfToken"] != nil {
		t.Fatal("User cookie was not deleted from the store!")
	}
}

func TestAuthenticateSession(t *testing.T) {
	// mocking the echo context
	e := echo.New()
	e_unauthorized := echo.New()

	// initializing cookie store
	var store = sessions.NewCookieStore([]byte("test"))

	// Unauthorized user
	req_unauthorized := httptest.NewRequest(http.MethodPost, "/", nil)
	res_unauthorized := httptest.NewRecorder()
	context_unauthorized := e_unauthorized.NewContext(req_unauthorized, res_unauthorized)

	// mocking http request:
	csrfTokenBody := map[string]interface{}{"csrf_token": "123"}
	body, _ := json.Marshal(csrfTokenBody)

	req := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	res := httptest.NewRecorder()
	c := e.NewContext(req, res)

	// create a cookie:
	session, _ := store.Get(req, "voxeti-session")
	session.Values["csrfToken"] = "123"
	_ = session.Save(req, res)
	session.IsNew = false

	// 1. Check that AuthenticateSession works properly:
	err := AuthenticateSession(c, store)

	if err.Code != 0 {
		t.Fatalf(`AuthenticateSession Failed with code: %d and message: %q`, err.Code, err.Message)
	}

	// 2. Check that AuthenticateSession fails when not provided a CSRFToken:
	req = httptest.NewRequest(http.MethodPost, "/", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	res = httptest.NewRecorder()
	c = e.NewContext(req, res)

	err = AuthenticateSession(c, store)

	if err.Code != 401 {
		t.Fatal("AuthenticateSession should fail with 401 when not provided CSRFToken! Currently passing.")
	}

	// 3. Check that AuthenticateSession fails when body is invalid:
	req = httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(body))
	res = httptest.NewRecorder()
	c = e.NewContext(req, res)

	err = AuthenticateSession(c, store)

	if err.Code != 500 {
		t.Fatal("AuthenticateSession should fail with 500 when unable to parse body! Currently passing.")
	}

	// 4. Check that AuthenticateSession fails when csrfToken provided does not match cookie csrfToken:
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

	session, _ = store.Get(req, "voxeti-session")
	session.Values["csrfToken"] = "something_else"
	_ = session.Save(req, res)
	session.IsNew = false

	err = AuthenticateSession(c, store)

	if err.Code != 401 {
		t.Fatal("AuthenticateSession should fail with 401 when given invalid csrfToken! Currently passing.")
	}

	// 5. Check that AuthenticateSession fails when cookie is expired:
	req = httptest.NewRequest(http.MethodPost, "/", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	res = httptest.NewRecorder()
	c = e.NewContext(req, res)

	session, _ = store.Get(req, "voxeti-session")
	session.Values["csrfToken"] = "123"
	_ = session.Save(req, res)
	session.Options.MaxAge = -1
	session.IsNew = false

	err = AuthenticateSession(c, store)
	if err.Code != 401 {
		t.Fatal("AuthenticateSession should fail with 401 when given an expired session cookie! Currently passing.")
	}

	// 6. Should throw error when unauthorized user attempts to access current user's session state
	err = AuthenticateSession(context_unauthorized, store)
	if err.Code == 0 || err.Message == "" {
		t.Fatal("Failed to prevent unauthorized user from authenticating.")
	}
}

func TestCheckPasswordHash(t *testing.T) {
	input := "password1"
	invalidInput := "password2"
	hashedInput := "$2a$10$yQMzszWR14B7a8WmQh4GT.gf4bf/x1ntXpX0kobFKIW8kOHQ2DOji"

	// 1. Check that the method returns true for equivalent hashed, and unhashed strings:
	if !CheckPasswordHash(input, hashedInput) {
		t.Fatal("CheckPasswordHash failed comparing equivalent plain string and hashed string. Should return true!")
	}

	// 2. Check that the method returns false of non-equivalent hashed, and unhashed strings:
	if CheckPasswordHash(invalidInput, hashedInput) {
		t.Fatal("CheckPasswordHash failed comparing non-equivalent plain string and hashed string. Should return false!")
	}

	// 3. Catch edge case of small change made to Hashed password
	isTrue := CheckPasswordHash("password1", "$2a$10$yQMzszWR14B7a8WmQh4GT.gf4bf/x1ntXpX0kobFKIW8kOHQ2DOj")
	if isTrue {
		t.Fatal("Failed to catch hash of password with one character deleted.")
	}
}

func TestGenerateCSRFToken(t *testing.T) {
	csrfToken, err := GenerateCSRFToken()

	if err != nil {
		t.Fatalf(`Error in generating CSRF Token: %q`, err.Error())
	}

	if csrfToken == "" {
		t.Fatal("Generated an empty String instead of a valid CSRF Token.")
	}
}
