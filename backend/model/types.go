package model

type User struct {
	UID         int64  `json:"uid"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Username    string `json:"username"`
	Email       string `json:"email"`
	DateOfBirth string `json:"date_of_birth"`
	Address     string `json:"address"`
	PhoneNumber string `json:"phone_number"`
	UserType    string `json:"user_type"`
}

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
