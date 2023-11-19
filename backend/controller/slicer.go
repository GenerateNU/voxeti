package controller

import (
	"net/http"
	"voxeti/backend/schema"
	"voxeti/backend/schema/slicer"
	"voxeti/backend/utilities"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

func RegisterSlicerHandlers(e *echo.Group, configuration schema.EstimateConfig, logger *pterm.Logger) {
	api := e.Group("/slicer")

	api.POST("/", func(c echo.Context) error {
		// Unmarshal the body of the request:
		var body schema.PriceEstimation
		err := c.Bind(&body)
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Invalid request body!"))
		}

		var priceEstimates []schema.EstimateBreakdown
		var totalVolume float32

		for _, file := range body.Slices {
			// Compute a price estimate for the file:
			priceEstimate, volume, err := slicer.EstimatePrice(body.Filament, body.Shipping, file, configuration)
			if err != nil {
				return c.JSON(utilities.CreateErrorResponse(err.Code, err.Message))
			}

			totalVolume += volume

			// Append the price estimates to the list of estimates:
			priceEstimates = append(priceEstimates, priceEstimate)
		}

		// Divide the shipping cost am
		if len(priceEstimates) > 1 {
			shippingEstimate, _ := slicer.EstimateShipping(totalVolume, len(priceEstimates), configuration.ShippingRate)
			for i, estimate := range priceEstimates {
				estimate.ShippingCost = shippingEstimate
				priceEstimates[i] = estimate
			}
		}

		return c.JSON(http.StatusOK, priceEstimates)
	})
}
