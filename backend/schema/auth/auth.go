package auth

import (
	"crypto/rand"
	"encoding/base64"
	"voxeti/backend/schema"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"

	"golang.org/x/crypto/bcrypt"
)

func Login(c echo.Context, store *sessions.CookieStore, dbClient *mongo.Client, credentials schema.Credentials) (*schema.LoginResponse, *schema.ErrorResponse) {
	response := &schema.LoginResponse{}
	errResponse := &schema.ErrorResponse{}

	// Look for the user in the database:
	user, err := GetUserByEmail(credentials.Email, dbClient)
	if err != nil {
		return nil, err
	}

	// Check if the incoming password is the same as the user password (if no social provider):
	if user.SocialProvider == "NONE" {
		if ok := CheckPasswordHash(credentials.Password, user.Password); !ok {
			errResponse.Code = 400
			errResponse.Message = "Invalid Password"
			return nil, errResponse
		}
	}

	// Create a new user session:
	csrfToken, err := CreateUserSession(c, store, user.Id.Hex())
	if err != nil {
		return nil, err
	}

	// Remove the password from the user object and return the user:
	user.Password = ""

	response.CSRFToken = *csrfToken
	response.User = *user

	return response, nil
}

func CreateUserSession(c echo.Context, store *sessions.CookieStore, userId string) (*string, *schema.ErrorResponse) {
	// Creating a new session:
	session, _ := store.Get(c.Request(), "voxeti-session")

	// Create a new CSRF Token:
	csrfToken, errResponse := GenerateCSRFToken()
	if errResponse != nil {
		errResponse.Code = 500
		errResponse.Message = "Failed creating a new CSRF Token"
		return nil, errResponse
	}

	// Add userId and csrfToken to the session:
	session.Values["userId"] = userId
	session.Values["csrfToken"] = csrfToken

	// Save the session to the cookie store:
	err := session.Save(c.Request(), c.Response())
	if err != nil {
		errResponse.Code = 500
		errResponse.Message = "Failed creating a new user session"
		return nil, errResponse
	}
	return &csrfToken, nil
}

func InvalidateUserSession(c echo.Context, store *sessions.CookieStore) *schema.ErrorResponse {
	errResponse := &schema.ErrorResponse{}

	// Retrieve the session:
	session, _ := store.Get(c.Request(), "voxeti-session")

	// Clear session values:
	delete(session.Values, "userId")
	delete(session.Values, "csrfToken")

	// Update the expiry:
	session.Options.MaxAge = -1

	// Save the updated session to the cookie store:
	err := session.Save(c.Request(), c.Response())
	if err != nil {
		errResponse.Code = 500
		errResponse.Message = "Failed invalidating the user session"
		return errResponse
	}
	return nil
}

func AuthenticateSession(c echo.Context, store *sessions.CookieStore) *schema.ErrorResponse {
	errResponse := &schema.ErrorResponse{}
	var requestBody map[string]interface{}

	if err := c.Bind(&requestBody); err != nil {
		errResponse.Code = 400
		errResponse.Message = "Failed to unmarshal request body!"
		return errResponse
	}

	csrfToken, ok := requestBody["csrfToken"].(string)
	if !ok {
		errResponse.Code = 401
		errResponse.Message = "Unauthorized Request"
		return errResponse
	}

	// Retrieve the session:
	session, _ := store.Get(c.Request(), "voxeti-session")

	// Check if the session is new or expired:
	if session.IsNew || session.Options.MaxAge < 0 || session.Values["csrfToken"] != csrfToken {
		errResponse.Code = 401
		errResponse.Message = "Unauthorized Request"
		return errResponse
	}
	return nil
}

func GoogleSSOAuthentication(accessToken schema.GoogleAccessToken, dbClient *mongo.Client) (*schema.ProviderUser, *schema.ErrorResponse) {
	googleSSOUser := &schema.ProviderUser{}

	// Retrieve the email of the Google User:
	googleUser, errResponse := GetGoogleSSOUser(accessToken)
	if errResponse != nil {
		return nil, errResponse
	}

	// Set initial fields:
	googleSSOUser.Email = googleUser.Email
	googleSSOUser.Provider = "GOOGLE"

	// Check whether the user is a new or existing user:
	_, errResponse = GetUserByEmail(googleUser.Email, dbClient)
	if errResponse != nil {
		googleSSOUser.UserType = "new"
	} else {
		googleSSOUser.UserType = "existing"
	}

	// Return the user:
	return googleSSOUser, nil
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenerateCSRFToken() (string, *schema.ErrorResponse) {
	errResponse := &schema.ErrorResponse{}

	randomBytes := make([]byte, 32)
	_, err := rand.Read(randomBytes)
	if err != nil {
		errResponse.Code = 500
		errResponse.Message = "Failed to create random byte array!"
		return "", errResponse
	}

	token := base64.URLEncoding.EncodeToString(randomBytes)
	return token, nil
}
