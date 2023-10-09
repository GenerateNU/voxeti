// nolint
package schema

import (
	"github.com/paulmach/orb/geojson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
)

// Database Name:
var DatabaseName = "data"

// 1. Key schema

// A Voxeti User, can be both a Designer and a Producer
type User struct {
	Id                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FirstName         string             `bson:"firstName" json:"firstName"`
	LastName          string             `bson:"lastName" json:"lastName"`
	Email             string             `bson:"email,omitempty" json:"email"`
	Password          string             `bson:"password,omitempty" json:"password"`
	Addresses         []Address          `bson:"addresses,omitempty" json:"addresses"`
	PhoneNumber       PhoneNumber        `bson:"phoneNumber,omitempty" json:"phoneNumber"`
	Experience        ExperienceLevel    `bson:"experience,omitempty" json:"experience"`
	Printers          []Printer          `bson:"printers,omitempty" json:"printers"`
	AvailableFilament []Filament         `bson:"availableFilament,omitempty" json:"availableFilament"`
}

// A Voxeti print Job
type Job struct {
	Id         primitive.ObjectID `bson:"_id,omitempty"`
	DesignerId primitive.ObjectID `bson:"designer_id,omitempty"`
	ProducerId primitive.ObjectID `bson:"producer_id,omitempty"`
	DesignId   primitive.ObjectID `bson:"design_id,omitempty"`
	Status     JobStatus          `bson:"status,omitempty"`
	Price      uint               `bson:"price,omitempty"`
	Color      string             `bson:"color,omitempty"`
	Filament   FilamentType       `bson:"filament,omitempty"`
	Dimensions Dimensions         `bson:"dimensions,omitempty"`
	Scale      uint               `bson:"scale,omitempty"`
}

// A Design is just a GridFS file, but renamed to match Voxeti branding
type Design gridfs.File

// 2. Supporting schema

// An address
type Address struct {
	Name     string           `bson:"name,omitempty"`
	Line1    string           `bson:"line1,omitempty"`
	Line2    string           `bson:"line2,omitempty"`
	ZipCode  string           `bson:"zipCode,omitempty"`
	City     string           `bson:"city,omitempty"`
	State    string           `bson:"state,omitempty"`
	Country  string           `bson:"country,omitempty"`
	Location geojson.Geometry `bson:"location,omitempty"`
}

// A phone number
type PhoneNumber struct {
	AreaCode string `bson:"areaCode,omitempty"`
	Number   string `bson:"number,omitempty"`
}

// Go does not have native enums, so this is a close approximation for 3D printing experience level
type ExperienceLevel int

const (
	NoExperience = iota
	SomeExperince
	MaxExperience
)

// A 3D printer
type Printer struct {
	SupportedFilament []FilamentType `bson:"supportedFilament,omitempty"`
	Dimensions        Dimensions     `bson:"dimensions,omitempty"`
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
	height uint `bson:"height,omitempty"`
	width  uint `bson:"width,omitempty"`
	depth  uint `bson:"depth,omitempty"`
}

// A filament
type Filament struct {
	Type         FilamentType `bson:"type,omitempty"`
	Color        string       `bson:"color,omitempty"`
	PricePerUnit uint         `bson:"pricePerUnit,omitempty"`
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
