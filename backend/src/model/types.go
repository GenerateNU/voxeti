package model

type Profile struct {
	Email    string `json:"email" db:"email"`
	Name     string `json:"name" db:"name"`
	Location string `json:"location" db:"location"`
	UserType string `json:"type" db:"type"`
}
