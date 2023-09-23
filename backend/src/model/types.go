package model

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Tentative
type User struct {
	Id        int    `json:"id"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	UserType  int    `json:"user_type"`
}

type CSRFToken struct {
	CSRFToken string `json:"csrf_token"`
}
