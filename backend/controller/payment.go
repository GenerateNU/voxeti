package controller

import (
	"net/http"
	"os"
	"voxeti/backend/schema"
	"voxeti/backend/utilities"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/pterm/pterm"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/checkout/session"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterPaymentHandlers(e *echo.Group, dbClient *mongo.Client, logger *pterm.Logger) {
	// This is a public sample test API key.
	// Don’t submit any personally identifiable information in requests made with this key.
	// Sign in to see your own test API key embedded in code samples.
	godotenv.Load(".env")
	stripe.Key = os.Getenv("STRIPE_API_SECRET_KEY")
	api := e.Group("/payment")

	api.Use(middleware.Logger())
	api.Use(middleware.Recover())

	api.POST("/create-checkout-session", createCheckoutSession)

}

type CheckoutData struct {
	ClientSecret string `json:"client_secret"`
}

type CheckoutBody struct {
	Prices   []schema.EstimateBreakdown `json:"prices"`
	Quantity int                        `json:"quantity"`
}

func createCheckoutSession(c echo.Context) (err error) {
	// c.Request().Body
	// body := c.Request().Body
	checkoutBody := CheckoutBody{}
	if err := c.Bind(&checkoutBody); err != nil {
		return c.JSON(utilities.CreateErrorResponse(400, "Failed to unmarshal request body"))
	}

	lineItems := []*stripe.CheckoutSessionLineItemParams{
		&stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency: stripe.String("usd"),
				ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
					Name: stripe.String("T-shirt"),
				},
				UnitAmount: stripe.Int64(2000),
			},
			Quantity: stripe.Int64(2),
		},
	}
	/*
	  lineItems := []*stripe.CheckoutSessionLineItemParams{}

	  products := []struct {
	      name     string
	      unitCost int64
	      quantity int64
	  }{
	      {"T-shirt", 2000, 2},
	      {"Sweatshirt", 3000, 1},
	      // Add more products here
	  }

	  for _, product := range products {
	      lineItem := &stripe.CheckoutSessionLineItemParams{
	          PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
	              Currency: stripe.String("usd"),
	              ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
	                  Name: stripe.String(product.name),
	              },
	              UnitAmount: stripe.Int64(product.unitCost),
	          },
	          Quantity: stripe.Int64(product.quantity),
	      }
	      lineItems = append(lineItems, lineItem)
	  }
	*/

	params := &stripe.CheckoutSessionParams{
		Mode:                 stripe.String(string(stripe.CheckoutSessionModePayment)),
		UIMode:               stripe.String("embedded"),
		RedirectOnCompletion: stripe.String("never"),
		LineItems:            lineItems,
		AutomaticTax:         &stripe.CheckoutSessionAutomaticTaxParams{Enabled: stripe.Bool(true)},
	}

	s, _ := session.New(params)

	if err != nil {
		return err
	}

	data := CheckoutData{
		ClientSecret: s.ClientSecret,
	}

	return c.JSON(http.StatusOK, data)
}
