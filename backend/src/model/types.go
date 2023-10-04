package model

type ExperienceLevel string;
// Placeholder values:
const (
	NOVICE 				ExperienceLevel = "Novice"
	PROFICIENT 		ExperienceLevel = "Proficient"
	EXPERT 				ExperienceLevel = "Expert"
)

type FilamentType string;
// Placeholder values:
const (
	PLA 					FilamentType = "PLA"
	ABS 					FilamentType = "ABS"
	CARBONFIBER 	FilamentType = "Carbon Fiber"
	NYLON					FilamentType = "Nylon"
	FLEX					FilamentType = "FLEX"
	HIPS					FilamentType = "HIPS"
	PVA						FilamentType = "PVA"
	PETG					FilamentType = "PETG"
	TPE 					FilamentType = "TPE"
	PC						FilamentType = "PC"
)

type Color string;
// Placeholder values:
const (
	RED 					Color = "Red"
	GREEN 				Color = "Green"
	YELLOW 				Color = "Yellow"
	BLUE					Color = "Blue"
	PINK					Color = "Pink"
	PURPLE				Color = "Purple"
)

type ErrorResponse struct {
	Code    							int    					`json:"code"`
	Message 							string 					`json:"message"`
}

type Credentials struct {
	Email    							string 					`json:"email"`
	Password 							string 					`json:"password"`
}

type CSRFToken struct {
	CSRFToken 						string 					`json:"csrf_token"`
}


type Location struct {
	Type									string					`json:"type" bson:"type"`
	Coordinates						[]float64				`json:"coordinates" bson:"coordinates"`
}

type PhoneNumber struct {
	CountryCode 					string 					`bson:"countryCode" json:"countryCode"`
	Number      					string					`bson:"number" json:"number"`
}

type Address struct {
	Name									string 				  `json:"name" bson:"name"`
	AddressLine1  				string 					`json:"addressLine1" bson:"addressLine1"`
	AddressLine2 					string 					`json:"addressLine2" bson:"addressLine2"`
	ZipCode								string 					`json:"zipCode" bson:"zipCode"`
	City									string 					`json:"city" bson:"city"`			
	State									string 					`json:"state" bson:"state"`
	Country								string 					`json:"country" bson:"country"` 
	Location		  				Location   		  `json:"coordinates" bson:"coordinates"`
}

type Dimensions struct {
	Height								float32					`json:"height" bson:"height"`
	Depth									float32					`json:"depth" bson:"depth"`
	Width									float32					`json:"width" bson:"width"`
}

type Printer struct {
	SupportedFilaments    []FilamentType	`json:"supportedFilaments" bson:"supportedFilaments"`
	Dimensions						Dimensions			`json:"dimensions" bson:"dimensions"`
}

type Filament struct {
	Type                  FilamentType    `json:"type" bson:"type"`
	Color									Color           `json:"color" bson:"color"`
	PricePerUnit					float32					`json:"pricePerUnit" bson:"pricePerUnit"`
}

type User struct {
	Id        						string    		  `json:"id" bson:"_id,omitempty"`
	Email     						string 					`json:"email" bson:"email"`
	Password  						string 					`json:"password" bson:"password"`
	FirstName 						string 					`json:"firstName" bson:"firstName"`
	LastName  						string 					`json:"lastName" bson:"lastName"` 
	Addresses							[]Address				`json:"addresses" bson:"addresses"`
	PhoneNumber						PhoneNumber 		`json:"phoneNumber" bson:"phoneNumber"`
	Experience						ExperienceLevel `json:"experienceLevel" bson:"experienceLevel"`
	Printers							[]Printer				`json:"printers" bson:"printers"`
	AvailableFilaments		[]Filament			`json:"availableFilaments" bson:"availableFilaments"`
}
