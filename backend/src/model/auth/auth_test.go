package auth

import (
	"bytes"
	"encoding/json"
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
	// mocking the echo context
	e := echo.New()

	// initializing cookie store
	var store = sessions.NewCookieStore([]byte("test"))

	// mocking http request:
	csrfTokenBody := map[string]interface{}{"csrf_token": "123"}
	body, _ := json.Marshal(csrfTokenBody)

	req := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
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
	req.Header.Set("Content-Type", "application/json")
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
	req.Header.Set("Content-Type", "application/json")

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
	req.Header.Set("Content-Type", "application/json")
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
}

func TestCheckPasswordHash(t *testing.T) {
	input := "password1"
	invalidInput := "password2"
	hashedInput := "$2a$10$yQMzszWR14B7a8WmQh4GT.gf4bf/x1ntXpX0kobFKIW8kOHQ2DOji"

	// 1. Check that the method returns true for equivalent hashed, and unhashed strings:
	if !CheckPasswordHash(input, hashedInput) {
		t.Fatal("CheckPasswordHash failed comparing equivalent plain string and hashed string. Should return true!")
	}

	// 1. Check that the method returns false of non-equivalent hashed, and unhashed strings:
	if CheckPasswordHash(invalidInput, hashedInput) {
		t.Fatal("CheckPasswordHash failed comparing non-equivalent plain string and hashed string. Should return false!")
	}
}

func TestGenerateCSRFToken(t *testing.T) {

}
