package model

import "time"

type Credentials struct {
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type User struct {
	Email     string `json:"email" db:"email"`
	Password  string `json:"password" db:"password"`
	FirstName string `json:"first_name" db:"first_name"`
	LastName  string `json:"last_name" db:"last_name"`
}

type Token struct {
	AccessToken string    `json:"access_token" db:"access_token"`
	ExpiresAt   time.Time `json:"expires_at" db:"expires_at"`
}
