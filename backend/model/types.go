package model

type User struct {
	Username    string      `bson:"username"`
	FirstName   string      `bson:"firstName"`
	LastName    string      `bson:"lastName"`
	Email       string      `bson:"email"`
	Birthday    string      `bson:"birthday"`
	PhoneNumber PhoneNumber `bson:"phoneNumber"`
	UserType    string      `bson:"userType"`
}

type PhoneNumber struct {
	CountryCode string `bson:"countryCode"`
	Number      string `bson:"number"`
}

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
