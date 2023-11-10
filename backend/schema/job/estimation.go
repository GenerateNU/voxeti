package job

import (
	"math"
	"sort"
	"voxeti/backend/schema"

	"github.com/spf13/viper"
)

func LoadEstimateConfig() {
	// Set the file name of the configurations file
	viper.SetConfigName("estimate_config")

	// Set the path to look for the configurations file
	viper.AddConfigPath("/config/")

	viper.SetConfigType("yml")
	var configuration schema.EstimateConfig

	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}

	err := viper.Unmarshal(&configuration)
	if err != nil {
		panic(err)
	}
}

func EstimatePrice(job schema.Job, sliceData schema.SliceData, config schema.EstimateConfig) (schema.EstimateBreakdown, *schema.ErrorResponse) {
	// Convert time in seconds to hours then with hourly rate
	timeCost := float32(sliceData.TimeS) / 3600.0 * config.HourlyCost
	// Filament used (in meters) multiplied with the cost per meter
	filamentCost := sliceData.FilamentUsed * config.FilamentCost[string(job.Filament)]

	// Get volume in millimeters cubed
	volume := (sliceData.MaxX - sliceData.MinX) * (sliceData.MaxY - sliceData.MinY) * (sliceData.MaxZ - sliceData.MinZ)
	// Convert volume to inches cubed
	volume = volume * 0.000061024

	// Check volume is in range and use that cost
	var shippingCost float32
	keys := make([]int, 0)
	for k := range config.ShippingRate {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	for _, k := range keys {
		if int(volume) <= k {
			shippingCost = config.ShippingRate[k]
			break
		}
	}

	producerSubtotal := config.BaseCost + timeCost + filamentCost + shippingCost
	producerFee := producerSubtotal * config.ProducerFee
	producerTotal := producerSubtotal + producerFee

	taxCost := producerSubtotal * config.TaxRate
	stripeCost := producerSubtotal * config.StripeFee
	voxetiCost := producerSubtotal * config.VoxetiFee

	total := producerTotal + taxCost + stripeCost + voxetiCost

	estimate := schema.EstimateBreakdown{
		BaseCost:         float32(math.Round(float64(config.BaseCost)*100) / 100),
		TimeCost:         float32(math.Round(float64(timeCost)*100) / 100),
		FilamentCost:     float32(math.Round(float64(filamentCost)*100) / 100),
		ShippingCost:     float32(math.Round(float64(shippingCost)*100) / 100),
		ProducerSubtotal: float32(math.Round(float64(producerSubtotal)*100) / 100),
		ProducerFee:      float32(math.Round(float64(producerFee)*100) / 100),
		ProducerTotal:    float32(math.Round(float64(producerTotal)*100) / 100),
		TaxCost:          float32(math.Round(float64(taxCost)*100) / 100),
		StripeCost:       float32(math.Round(float64(stripeCost)*100) / 100),
		VoxetiCost:       float32(math.Round(float64(voxetiCost)*100) / 100),
		Total:            float32(math.Round(float64(total)*100) / 100),
	}

	return estimate, nil
}
