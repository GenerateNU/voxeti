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

		for _, file := range body.Slices {
			// Compute a price estimate for the file:
			priceEstimate, err := slicer.EstimatePrice(body.Filament, body.Shipping, file, configuration)
			if err != nil {
				return c.JSON(utilities.CreateErrorResponse(err.Code, err.Message))
			}

			// Append the price estimates to the list of estimates:
			priceEstimates = append(priceEstimates, priceEstimate)
		}

		return c.JSON(http.StatusOK, priceEstimates)
	})
}
