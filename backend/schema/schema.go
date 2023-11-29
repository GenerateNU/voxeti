// nolint
package schema

import (
	"time"

	"github.com/paulmach/orb/geojson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Database Name:
var DatabaseName = "data"

// 1. Key schema

// A Voxeti User, can be both a Designer and a Producer
type User struct {
	Id                primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	FirstName         string             `bson:"firstName,omitempty" json:"firstName,omitempty"`
	LastName          string             `bson:"lastName,omitempty" json:"lastName,omitempty"`
	Email             string             `bson:"email,omitempty" json:"email,omitempty"`
	Password          string             `bson:"password,omitempty" json:"password,omitempty"`
	SocialProvider    SocialProvider     `bson:"socialProvider,omityempty" json:"socialProvider,omitempty"`
	Addresses         []Address          `bson:"addresses,omitempty" json:"addresses,omitempty"`
	PhoneNumber       *PhoneNumber       `bson:"phoneNumber,omitempty" json:"phoneNumber,omitempty"`
	Experience        ExperienceLevel    `bson:"experience,omitempty" json:"experience,omitempty"`
	Printers          []Printer          `bson:"printers,omitempty" json:"printers,omitempty"`
	AvailableFilament []Filament         `bson:"availableFilament,omitempty" json:"availableFilament,omitempty"`
}

// A Voxeti print Job
type Job struct {
	Id                 primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	CreatedAt          primitive.DateTime   `bson:"createdAt,omitempty" json:"createdAt"`
	DesignerId         primitive.ObjectID   `bson:"designerId,omitempty" json:"designerId"`
	ProducerId         primitive.ObjectID   `bson:"producerId,omitempty" json:"producerId"`
	DesignId           []primitive.ObjectID `bson:"designId,omitempty" json:"designId"`
	Quantity           []int32              `bson:"quantity,omitempty" json:"quantity"`
	Status             JobStatus            `bson:"status,omitempty" json:"status"`
	Price              int                  `bson:"price,omitempty" json:"price"`
	Shipping           int                  `bson:"shipping,omitempty" json:"shipping"`
	Taxes              int                  `bson:"taxes,omitempty" json:"taxes"`
	Color              string               `bson:"color,omitempty" json:"color"`
	Filament           FilamentType         `bson:"filament,omitempty" json:"filament"`
	LayerHeight        float64              `bson:"layerHeight,omitempty" json:"layerHeight"`
	ShippingAddress    Address              `bson:"shippingAddress,omitempty" json:"shippingAddress"`
	DeclinedProducers  []primitive.ObjectID `bson:"declinedProducers,omitempty" json:"declinedProducers"`
	PotentialProducers []primitive.ObjectID `bson:"potentialProducers,omitempty" json:"potentialProducers"`
	LastUpdated        time.Time            `bson:"lastUpdated,omitempty" json:"lastUpdated"`
	// lastUpdated represents last time a potential producer was added
}

// A Design is just a GridFS file, but renamed to match Voxeti branding
type Design struct {
	Id         primitive.ObjectID `bson:"_id" json:"id"`
	Name       string             `bson:"name" json:"name"`
	Length     int64              `bson:"length" json:"length"`
	Dimensions Dimensions         `bson:"dimensions" json:"dimensions"`
}

// 2. Supporting schema

// An address
type Address struct {
	Name     string           `bson:"name,omitempty" json:"name,omitempty"`
	Line1    string           `bson:"line1,omitempty" json:"line1,omitempty"`
	Line2    string           `bson:"line2,omitempty" json:"line2,omitempty"`
	ZipCode  string           `bson:"zipCode,omitempty" json:"zipCode,omitempty"`
	City     string           `bson:"city,omitempty" json:"city,omitempty"`
	State    string           `bson:"state,omitempty" json:"state,omitempty"`
	Country  string           `bson:"country,omitempty" json:"country,omitempty"`
	Location geojson.Geometry `bson:"location,omitempty" json:"location,omitempty"`
}

// A phone number
type PhoneNumber struct {
	CountryCode string `bson:"countryCode,omitempty" json:"countryCode,omitempty"`
	Number      string `bson:"number,omitempty" json:"number,omitempty"`
}

// Go does not have native enums, so this is a close approximation for 3D printing experience level
type ExperienceLevel int

const (
	NoExperience = iota + 1
	SomeExperince
	MaxExperience
)

// A 3D printer
type Printer struct {
	SupportedFilament []FilamentType `bson:"supportedFilament,omitempty" json:"supportedFilament,omitempty"`
	Dimensions        Dimensions     `bson:"dimensions,omitempty" json:"dimensions,omitempty"`
}

// Go does not have native enums, so this is a close approximation for types of Filament
type FilamentType string

const (
	PLA = "PLA"
	ABS = "ABS"
	TPE = "TPE"
)

// Print/printer physical dimensions
type Dimensions struct {
	Height uint64 `bson:"height,omitempty" json:"height,omitempty"`
	Width  uint64 `bson:"width,omitempty" json:"width,omitempty"`
	Depth  uint64 `bson:"depth,omitempty" json:"depth,omitempty"`
}

// A filament
type Filament struct {
	Type         FilamentType `bson:"type,omitempty" json:"type,omitempty"`
	Color        string       `bson:"color,omitempty" json:"color,omitempty"`
	PricePerUnit uint         `bson:"pricePerUnit,omitempty" json:"pricePerUnit,omitempty"`
}

// Go does not have native enums, so this is a close approximation for Job status
type JobStatus string

const (
	Pending    = "PENDING"
	Accepted   = "ACCEPTED"
	InProgress = "INPROGRESS"
	InShipping = "INSHIPPING"
	Complete   = "COMPLETE"
)

type SocialProvider string

const (
	None   = "NONE"
	Google = "GOOGLE"
)
