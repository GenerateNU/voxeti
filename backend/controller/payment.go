package controller

import (
    "net/http"
    "os"

    "github.com/stripe/stripe-go/v76"
    "github.com/joho/godotenv"
    "go.mongodb.org/mongo-driver/mongo"
    "github.com/pterm/pterm"
    "github.com/stripe/stripe-go/v76/checkout/session"
	  "github.com/labstack/echo/v4"
  	"github.com/labstack/echo/v4/middleware"
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

func createCheckoutSession(c echo.Context) (err error) {
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
  
  params := &stripe.CheckoutSessionParams{
    Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
    UIMode: stripe.String("embedded"),
    RedirectOnCompletion: stripe.String("never"),
    LineItems: lineItems,
    AutomaticTax: &stripe.CheckoutSessionAutomaticTaxParams{Enabled: stripe.Bool(true)},
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