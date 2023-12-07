package controller

import (
	"net/http"
	"os"
	"voxeti/backend/schema"
	"voxeti/backend/utilities"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/checkout/session"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterPaymentHandlers(e *echo.Group, dbClient *mongo.Client, logger *pterm.Logger) {
	// This is a public sample test API key.
	// Don’t submit any personally identifiable information in requests made with this key.
	// Sign in to see your own test API key embedded in code samples.
	err := godotenv.Load(".env")
	if err != nil {
		pterm.Info.Println("Failed to load environment variables, shutting down...")
		pterm.Fatal.WithFatal(false).Println(err)
		os.Exit(1)
	}
	stripe.Key = os.Getenv("STRIPE_API_SECRET_KEY")
	api := e.Group("/payment")

	api.POST("/create-checkout-session", func(c echo.Context) error {
		checkoutData, err := createCheckoutSession(c)
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(err.Code, err.Message))
		}

		return c.JSON(http.StatusOK, checkoutData)
	})

}

type CheckoutSessionData struct {
	ClientSecret string `json:"client_secret"`
}

type CheckoutBody struct {
	Prices     []schema.EstimateBreakdown `json:"prices"`
	Quantities []int                      `json:"quantities"`
}

func createCheckoutSession(c echo.Context) (CheckoutSessionData, *schema.ErrorResponse) {
	checkoutBody := CheckoutBody{}
	if err := c.Bind(&checkoutBody); err != nil {
		return CheckoutSessionData{}, &schema.ErrorResponse{Code: 500, Message: "Checkout body could not be parsed"}
	}

	lineItems := []*stripe.CheckoutSessionLineItemParams{}
	shippingTotal := float32(0.0)

	for i := 0; i < len(checkoutBody.Quantities); i++ {
		product := checkoutBody.Prices[i]
		quantity := int64(checkoutBody.Quantities[i])

		shippingTotal = shippingTotal + product.ShippingCost

		lineItem := &stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency: stripe.String("usd"),
				ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
					Name: stripe.String(product.File),
				},
				UnitAmount: stripe.Int64(int64((product.Total-product.ShippingCost-product.TaxCost)*100) / quantity),
			},
			Quantity: stripe.Int64(quantity),
			TaxRates: []*string{stripe.String("txr_1OJLSCFGCspn0XMmhhjjiiD9")},
		}
		lineItems = append(lineItems, lineItem)
	}

	shippingOptions := []*stripe.CheckoutSessionShippingOptionParams{
		&stripe.CheckoutSessionShippingOptionParams{
			ShippingRateData: &stripe.CheckoutSessionShippingOptionShippingRateDataParams{
				Type: stripe.String("fixed_amount"),
				FixedAmount: &stripe.CheckoutSessionShippingOptionShippingRateDataFixedAmountParams{
					Amount:   stripe.Int64(int64(shippingTotal * 100)),
					Currency: stripe.String(string(stripe.CurrencyUSD)),
				},
				DisplayName: stripe.String("Standard shipping"),
				DeliveryEstimate: &stripe.CheckoutSessionShippingOptionShippingRateDataDeliveryEstimateParams{
					Minimum: &stripe.CheckoutSessionShippingOptionShippingRateDataDeliveryEstimateMinimumParams{
						Unit:  stripe.String("business_day"),
						Value: stripe.Int64(5),
					},
					Maximum: &stripe.CheckoutSessionShippingOptionShippingRateDataDeliveryEstimateMaximumParams{
						Unit:  stripe.String("business_day"),
						Value: stripe.Int64(7),
					},
				},
			},
		},
	}

	params := &stripe.CheckoutSessionParams{
		Mode:                 stripe.String(string(stripe.CheckoutSessionModePayment)),
		UIMode:               stripe.String("embedded"),
		RedirectOnCompletion: stripe.String("never"),
		LineItems:            lineItems,
		ShippingOptions:      shippingOptions,
	}

	stripeSession, _ := session.New(params)

	data := CheckoutSessionData{
		ClientSecret: stripeSession.ClientSecret,
	}

	return data, nil
}
