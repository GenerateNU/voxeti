package auth

import (
	// "fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

// func TestBasic(t *testing.T) {
// 	expectedString := "test"
// 	want := regexp.MustCompile(`\b` + expectedString + `\b`)
// 	actualString := "test"
// 	if !want.MatchString(actualString) {
// 		t.Fatalf(`Actual = %q, expected = %#q`, actualString, want)
// 	}
// }

func TestLogin(t *testing.T) {

}

func TestCreateUserSession(t *testing.T) {
	// mocking the echo context
	e := echo.New()

	req := httptest.NewRequest(http.MethodPost, "/", nil)
	res := httptest.NewRecorder()
	c := e.NewContext(req, res)

	// initializing empty cookie store
	var store = sessions.NewCookieStore([]byte("test"))

	csrfToken, _ := CreateUserSession(c, store, 123)

	// 1. There is a csrfToken returned:
	if csrfToken == "" {
		t.Fatal("CreateUserSession failed to generate a csrf_token!")
	}

	// 2. There is a session created inside of the store that includes a CSRFToken and userId: 123
	session, _ := store.Get(c.Request(), "voxeti-session")

	if session.Values["userId"] != 123 || session.Values["csrfToken"] == nil {
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
	CreateUserSession(c, store, 123)

	// 1. Check to see if a cookie exists
	session, _ := store.Get(c.Request(), "voxeti-session")
	if session.Values["userId"] != 123 || session.Values["csrfToken"] == nil {
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

}

func TestCheckPasswordHash(t *testing.T) {

}

func TestGenerateCSRFToken(t *testing.T) {

}
