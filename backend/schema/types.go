package schema

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	CSRFToken string `json:"csrfToken"`
	User      User   `json:"user"`
}

type ProviderUser struct {
	Email    string `json:"user"`
	UserType string `json:"userType"`
	Provider string `json:"provider"`
}

type GoogleAccessToken struct {
	AccessToken string `json:"accessToken"`
}

type GoogleResponse struct {
	Email string `json:"email"`
	Scope string `json:"scope"`
}

type SliceData struct {
	File              string  `json:"file"`
	Quantity          int     `json:"quantity"`
	Flavor            string  `json:"flavor"`
	TimeS             int     `json:"time"`
	FilamentUsed      float32 `json:"filamentused"`
	LayerHeight       float32 `json:"layerheight"`
	MinX              float32 `json:"minx"`
	MinY              float32 `json:"miny"`
	MinZ              float32 `json:"minz"`
	MaxX              float32 `json:"maxx"`
	MaxY              float32 `json:"maxy"`
	MaxZ              float32 `json:"maxz"`
	TargetMachineName string  `json:"targetmachinename"`
}

type PriceEstimation struct {
	Shipping bool         `json:"shipping"`
	Filament FilamentType `json:"filamentType"`
	Slices   []SliceData  `json:"slices"`
}

type EstimateBreakdown struct {
	File                    string  `json:"file"`
	BaseCost                float32 `json:"baseCost"`
	TimeCost                float32 `json:"timeCost"`
	FilamentCost            float32 `json:"filamentCost"`
	ShippingCost            float32 `json:"shippingCost"`
	ProducerSubtotal        float32 `json:"producerSubTotal"`
	QuantityAppliedSubtotal float32 `json:"quantityAppliedSubtotal"`
	ProducerFee             float32 `json:"producerFee"`
	ProducerTotal           float32 `json:"producerTotal"`
	QuantityAppliedTotal    float32 `json:"quantityAppliedTotal"`
	TaxCost                 float32 `json:"taxCost"`
	StripeCost              float32 `json:"stripeCost"`
	VoxetiCost              float32 `json:"voxetiCost"`
	Total                   float32 `json:"total"`
}

type Shipping struct {
	Rates         map[int]float32
	OversizedRate float32
}

type EstimateConfig struct {
	BaseCost     float32
	HourlyCost   float32
	FilamentCost map[string]float32
	ShippingRate Shipping
	TaxRate      float32
	ProducerFee  float32
	StripeFee    float32
	VoxetiFee    float32
}
