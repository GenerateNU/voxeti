package auth

import (
	"crypto/rand"
	"encoding/base64"
	"voxeti/backend/src/model"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"

	"golang.org/x/crypto/bcrypt"
)

// For testing:
var usersTest []model.User = []model.User{
	{
		Id:        1,
		Email:     "user1@example.com",
		Password:  "$2a$10$yQMzszWR14B7a8WmQh4GT.gf4bf/x1ntXpX0kobFKIW8kOHQ2DOji", // password1
		FirstName: "John",
		LastName:  "Doe",
	},
	{
		Id:        2,
		Email:     "user2@example.com",
		Password:  "$2a$10$6kKTmL.QlNTHUBthBJBnjOwb8dpAO8a4wlLpRpy.SwzlIZ85PMtO6", // password2
		FirstName: "Jane",
		LastName:  "Smith",
	},
}

func Login(c echo.Context, store *sessions.CookieStore, credentials model.Credentials) (map[string]interface{}, model.ErrorResponse) {
	// TEMP CODE:
	// ------------------------------------------------
	var client model.User
	var found bool = false
	for _, user := range usersTest {
		if user.Email == credentials.Email {
			client = user
			found = true
			break
		}
	}

	if !found {
		return map[string]interface{}{}, model.ErrorResponse{Code: 400, Message: "User does not exist"}
	}
	// ------------------------------------------------

	// Check if the incoming password is the same as the user password:
	if ok := CheckPasswordHash(credentials.Password, client.Password); !ok {
		return map[string]interface{}{}, model.ErrorResponse{Code: 400, Message: "Invalid Password"}
	}

	// Create a new user session:
	csrfToken, err := CreateUserSession(c, store, client.Id)
	if err.Code != 0 {
		return map[string]interface{}{}, err
	}

	// Remove the password from the user object and return the user:
	client.Password = ""

	response := map[string]interface{}{
		"csrf_token": csrfToken,
		"user":       client,
	}

	return response, model.ErrorResponse{}
}

func CreateUserSession(c echo.Context, store *sessions.CookieStore, userId int) (string, model.ErrorResponse) {
	// Creating a new session:
	session, _ := store.Get(c.Request(), "voxeti-session")

	// Create a new CSRF Token:
	csrfToken, err := GenerateCSRFToken()
	if err != nil {
		return "", model.ErrorResponse{Code: 500, Message: "Failed creating a new CSRF Token"}
	}

	// Add userId and csrfToken to the session:
	session.Values["userId"] = userId
	session.Values["csrfToken"] = csrfToken

	// Save the session to the cookie store:
	err = session.Save(c.Request(), c.Response())
	if err != nil {
		return "", model.ErrorResponse{Code: 500, Message: "Failed creating a new user session"}
	}
	return csrfToken, model.ErrorResponse{}
}

func InvalidateUserSession(c echo.Context, store *sessions.CookieStore) model.ErrorResponse {
	// Retrieve the session:
	session, _ := store.Get(c.Request(), "voxeti-session")

	// Clear session values:
	delete(session.Values, "userId")

	// Update the expiry:
	session.Options.MaxAge = -1

	// Save the updated session to the cookie store:
	err := session.Save(c.Request(), c.Response())
	if err != nil {
		return model.ErrorResponse{Code: 500, Message: "Failed invalidating the user session"}
	}
	return model.ErrorResponse{}
}

func AuthenticateSession(c echo.Context, store *sessions.CookieStore) model.ErrorResponse {
	var requestBody map[string]interface{}

	if err := c.Bind(&requestBody); err != nil {
		return model.ErrorResponse{Code: 500, Message: "Failed to unmarshal request body!"}
	}

	csrfToken, ok := requestBody["csrf_token"].(string)
	if !ok {
		return model.ErrorResponse{Code: 401, Message: "Unauthorized Request"}
	}

	// Retrieve the session:
	session, _ := store.Get(c.Request(), "voxeti-session")

	// Check if the session is new or expired:
	if session.IsNew || session.Options.MaxAge < 0 || session.Values["csrfToken"] != csrfToken {
		return model.ErrorResponse{Code: 401, Message: "Unauthorized Request"}
	}
	return model.ErrorResponse{}
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenerateCSRFToken() (string, error) {
	randomBytes := make([]byte, 32)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}

	token := base64.URLEncoding.EncodeToString(randomBytes)
	return token, nil
}
