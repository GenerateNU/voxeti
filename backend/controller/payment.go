package controller

import (
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/checkout/session"
)

func RegisterPaymentHandlers(e *echo.Group, dbClient *mongo.Client, logger *pterm.Logger) {
	godotenv.Load(".env")
	api := e.Group("/payment")

	api.POST("/checkout-session", func(c echo.Context) error {
		stripe.Key = os.Getenv("STRIPE_API_SECRET_KEY")

		domain := "http://localhost:4000"
		params := &stripe.CheckoutSessionParams{
			LineItems: []*stripe.CheckoutSessionLineItemParams{
				&stripe.CheckoutSessionLineItemParams{
					PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
						Currency: stripe.String("usd"),
						ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
							Name: stripe.String("Printing Fee"),
						},
						// price in cents
						UnitAmount: stripe.Int64(1332),
					},
					Quantity: stripe.Int64(1),
				},
			},
			Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
			SuccessURL: stripe.String(domain + "/checkout?success=true"),
			CancelURL:  stripe.String(domain + "/checkout?canceled=true"),
		}

		s, err := session.New(params)

		if err != nil {
			fmt.Printf("session.New: %v", err)
		}
		return c.JSON(http.StatusOK, s.URL)
		// return c.Redirect(http.StatusTemporaryRedirect, s.URL)
	})
}
