package controller

import (
	"fmt"
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
	godotenv.Load(".env")
	stripe.Key = os.Getenv("STRIPE_API_SECRET_KEY")
	api := e.Group("/payment")

	// api.Use(middleware.Logger())
	// api.Use(middleware.Recover())

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
		fmt.Println(err.Error())
		return CheckoutSessionData{}, &schema.ErrorResponse{Code: 500, Message: "Checkout body could not be parsed"}
	}

  fmt.Println(checkoutBody)

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
				UnitAmount: stripe.Int64(int64(product.Total - product.ShippingCost - product.TaxCost) * 100),
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
          Amount: stripe.Int64(int64(shippingTotal * 100)),
          Currency: stripe.String(string(stripe.CurrencyUSD)),
        },
        DisplayName: stripe.String("Standard shipping"),
        DeliveryEstimate: &stripe.CheckoutSessionShippingOptionShippingRateDataDeliveryEstimateParams{
          Minimum: &stripe.CheckoutSessionShippingOptionShippingRateDataDeliveryEstimateMinimumParams{
            Unit: stripe.String("business_day"),
            Value: stripe.Int64(5),
          },
          Maximum: &stripe.CheckoutSessionShippingOptionShippingRateDataDeliveryEstimateMaximumParams{
            Unit: stripe.String("business_day"),
            Value: stripe.Int64(7),
          },
        },
      },
    },
  }
	// lineItems := []*stripe.CheckoutSessionLineItemParams{
	// 	&stripe.CheckoutSessionLineItemParams{
	// 		PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
	// 			Currency: stripe.String("usd"),
	// 			ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
	// 				Name: stripe.String("T-shirt"),
	// 			},
	// 			UnitAmount: stripe.Int64(2000),
	// 		},
	// 		Quantity: stripe.Int64(2),
	// 	},
	// }

	params := &stripe.CheckoutSessionParams{
		Mode:                 stripe.String(string(stripe.CheckoutSessionModePayment)),
		UIMode:               stripe.String("embedded"),
		RedirectOnCompletion: stripe.String("never"),
		LineItems:            lineItems,
    ShippingOptions:         shippingOptions,
	}

	stripeSession, _ := session.New(params)
	// if stripeErr != nil {
	// 	fmt.Println(stripeErr.Error())
	// 	return CheckoutSessionData{}, &schema.ErrorResponse{Code: 500, Message: stripeErr.Error()}
	// }

	data := CheckoutSessionData{
		ClientSecret: stripeSession.ClientSecret,
	}
	fmt.Println(data.ClientSecret)

	return data, nil
}
