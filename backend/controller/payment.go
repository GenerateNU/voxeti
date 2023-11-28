package controller

import (
    "net/http"
    "github.com/stripe/stripe-go/v76"
    "github.com/stripe/stripe-go/v76/checkout/session"
	"github.com/labstack/echo/v4"
  	"github.com/labstack/echo/v4/middleware"
)

func RegisterPaymentHandlers() {
  // This is a public sample test API key.
  // Don’t submit any personally identifiable information in requests made with this key.
  // Sign in to see your own test API key embedded in code samples.
  stripe.Key = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"

  e := echo.New()
  e.Use(middleware.Logger())
  e.Use(middleware.Recover())

  e.POST("/create-checkout-session", createCheckoutSession)

  e.Logger.Fatal(e.Start("localhost:4242"))
}

type CheckoutData struct {
  ClientSecret string `json:"client_secret"`
}

func createCheckoutSession(c echo.Context) (err error) {
  params := &stripe.CheckoutSessionParams{
    Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
    UIMode: stripe.String("embedded"),
    LineItems: []*stripe.CheckoutSessionLineItemParams{
      &stripe.CheckoutSessionLineItemParams{
        PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
          Currency: stripe.String("usd"),
          ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
            Name: stripe.String("T-shirt"),
          },
          UnitAmount: stripe.Int64(2000),
        },
        Quantity: stripe.Int64(1),
      },
    },
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