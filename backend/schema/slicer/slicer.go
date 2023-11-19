package slicer

import (
	"math"
	"sort"
	"strings"
	"voxeti/backend/schema"

	"github.com/spf13/viper"
)

func LoadEstimateConfig(location string, name string) schema.EstimateConfig {
	// Set the file name of the configurations file
	viper.SetConfigName(name)

	// Set the path to look for the configurations file
	// Root directory
	viper.AddConfigPath(location)

	viper.SetConfigType("yml")
	var configuration schema.EstimateConfig

	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}

	err := viper.Unmarshal(&configuration)
	if err != nil {
		panic(err)
	}

	return configuration
}

func EstimatePrice(filamentType schema.FilamentType, shipping bool, sliceData schema.SliceData, config schema.EstimateConfig) (breakdown schema.EstimateBreakdown, printVolume float32, err *schema.ErrorResponse) {
	// Convert time in seconds to hours then with hourly rate
	timeCost := float32(sliceData.TimeS) / 3600.0 * config.HourlyCost
	// Filament used (in meters) multiplied with the cost per meter
	filamentCost := sliceData.FilamentUsed * config.FilamentCost[strings.ToLower(string(filamentType))]

	// Get volume in millimeters cubed
	volume := (sliceData.MaxX - sliceData.MinX) * (sliceData.MaxY - sliceData.MinY) * (sliceData.MaxZ - sliceData.MinZ)
	// Convert volume to inches cubed
	volume = volume * 0.000061024

	// Check volume is in range and use that cost
	var shippingCost float32
	if shipping {
		shippingCost, _ = EstimateShipping(volume, 1, config.ShippingRate)
	} else {
		shippingCost = 0
	}

	producerSubtotal := config.BaseCost + timeCost + filamentCost + shippingCost
	producerFee := producerSubtotal * config.ProducerFee
	producerTotal := producerSubtotal + producerFee

	quantityAppliedSubtotal := float32(sliceData.Quantity) * producerSubtotal
	quantityAppliedTotal := float32(sliceData.Quantity) * producerTotal

	stripeCost := quantityAppliedSubtotal * config.StripeFee
	voxetiCost := quantityAppliedSubtotal * config.VoxetiFee

	tempTotal := quantityAppliedTotal + stripeCost + voxetiCost
	taxCost := tempTotal * config.TaxRate
	total := tempTotal + taxCost

	estimate := schema.EstimateBreakdown{
		File:                    sliceData.File,
		BaseCost:                float32(math.Round(float64(config.BaseCost)*100) / 100),
		TimeCost:                float32(math.Round(float64(timeCost)*100) / 100),
		FilamentCost:            float32(math.Round(float64(filamentCost)*100) / 100),
		ShippingCost:            float32(math.Round(float64(shippingCost)*100) / 100),
		ProducerSubtotal:        float32(math.Round(float64(producerSubtotal)*100) / 100),
		QuantityAppliedSubtotal: float32(math.Round(float64(quantityAppliedSubtotal)*100) / 100),
		ProducerFee:             float32(math.Round(float64(producerFee)*100) / 100),
		ProducerTotal:           float32(math.Round(float64(producerTotal)*100) / 100),
		QuantityAppliedTotal:    float32(math.Round(float64(quantityAppliedTotal)*100) / 100),
		TaxCost:                 float32(math.Round(float64(taxCost)*100) / 100),
		StripeCost:              float32(math.Round(float64(stripeCost)*100) / 100),
		VoxetiCost:              float32(math.Round(float64(voxetiCost)*100) / 100),
		Total:                   float32(math.Round(float64(total)*100) / 100),
	}

	return estimate, volume, nil
}

// Estimates the total cost when given the volume and number of items, uses oversized rate if too big for set prices
func EstimateShipping(totalVolume float32, quantity int, shippingRates schema.Shipping) (shippingCost float32, err *schema.ErrorResponse) {
	keys := make([]int, 0)
	for k := range shippingRates.Rates {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	for _, k := range keys {
		if int(totalVolume) <= k {
			return float32(math.Round(float64(shippingRates.Rates[k]/float32(quantity))*100) / 100), nil
		}
	}

	// If oversized
	return float32(math.Round(float64(totalVolume*shippingRates.OversizedRate/float32(quantity))*100) / 100), nil
}
