package model

import (
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

type Auth interface {
	Login(Credentials) User
}

var usersTest []User = []User{
	{
		Email:     "user1@example.com",
		Password:  "$2a$10$yQMzszWR14B7a8WmQh4GT.gf4bf/x1ntXpX0kobFKIW8kOHQ2DOji",
		FirstName: "John",
		LastName:  "Doe",
	},
	{
		Email:     "user2@example.com",
		Password:  "$2a$10$6kKTmL.QlNTHUBthBJBnjOwb8dpAO8a4wlLpRpy.SwzlIZ85PMtO6",
		FirstName: "Jane",
		LastName:  "Smith",
	},
}

// Log the user into the application:
func Login(credentials Credentials) (Token, error) {
	// TODO: DB Lookup by username:
	// Can throw "User does not exist" error -> redirect to sign-up

	// TEMP CODE:
	// -----------------------------------------------------
	var client User
	var found bool = false
	for _, user := range usersTest {
		if user.Email == credentials.Email {
			client = user
			found = true
			break
		}
	}

	if !found {
		return Token{}, errors.New("User does not exist")
	}

	// -----------------------------------------------------

	// Check if the incoming password is the same as the user password. If success, user has been Authed!
	if ok := CheckPasswordHash(credentials.Password, client.Password); !ok {
		return Token{}, errors.New("Invalid password")
	}

	// Create a JWT Token
	token, err := CreateJWTToken()

	if err != nil {
		return Token{}, errors.New("Failed creating access token")
	}

	// Pass the user data and JWT token back to the client
	var userToken Token
	userToken.AccessToken = token.AccessToken

	return userToken, nil
}

// Create a JWT token:
func CreateJWTToken() (Token, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	exp := time.Now().Add(time.Second * 10) // UPDATE AFTER TESTING

	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = exp

	jwtToken, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		return Token{}, err
	}

	var accessToken Token
	accessToken.AccessToken = jwtToken
	accessToken.ExpiresAt = exp
	return accessToken, nil
}

// Middleware to secure API routes with JWT tokens:
func ValidateJWTMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			return c.String(http.StatusUnauthorized, "Unauthorized Request")
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		// jwtExp := token.Claims.(jwt.MapClaims)["exp"].(float64)

		if err != nil || !token.Valid {
			return c.String(http.StatusUnauthorized, "Unauthorized Request")
		}

		// If the token is valid, proceed to the next middleware or route handler
		return next(c)
	}
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
