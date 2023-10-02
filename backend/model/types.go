package model

type User struct {
	Username    string      `bson:"username" json:"username"`
	FirstName   string      `bson:"firstName" json:"firstName"`
	LastName    string      `bson:"lastName" json:"lastName"`
	Email       string      `bson:"email" json:"email"`
	Birthday    string      `bson:"birthday" json:"birthday"`
	PhoneNumber PhoneNumber `bson:"phoneNumber" json:"phoneNumber"`
	UserType    string      `bson:"userType" json:"userType"`
}

type PhoneNumber struct {
	CountryCode string `bson:"countryCode" json:"countryCode"`
	Number      string `bson:"number" json:"number"`
}

type UserResponse struct {
	Id   string `bson:"_id" json:"id"`
	User User   `bson:"user" json:"user"`
}

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
