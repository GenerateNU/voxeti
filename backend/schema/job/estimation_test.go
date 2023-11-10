package job

import (
	"testing"
	"voxeti/backend/schema"
)

var config = schema.EstimateConfig{
	BaseCost:   1.00,
	HourlyCost: 3.00,
	FilamentCost: map[string]float32{
		schema.PLA: 0.09,
		schema.ABS: 0.07,
		schema.TPE: 0.12,
	},
	ShippingRate: map[int]float32{
		100:  10.20,
		250:  13.35,
		650:  16.05,
		1050: 21.05,
		1728: 26.05,
	},
	TaxRate:     0.065,
	ProducerFee: 0.20,
	StripeFee:   0.03,
	VoxetiFee:   0.05,
}

func TestEstimation(t *testing.T) {
	job := schema.Job{
		Filament: schema.PLA,
	}

	sliceData := schema.SliceData{
		Flavor:            "Marlin",
		TimeS:             6093,
		FilamentUsed:      2.326,
		LayerHeight:       0.2,
		MinX:              92.052,
		MinY:              91.423,
		MinZ:              0.3,
		MaxX:              143.78,
		MaxY:              143.575,
		MaxZ:              61.9,
		TargetMachineName: "Creality Ender 3",
	}

	estimate, _ := EstimatePrice(job, sliceData, config)

	expected := schema.EstimateBreakdown{
		BaseCost:         1.00,
		TimeCost:         5.08,
		FilamentCost:     0.21,
		ShippingCost:     10.20,
		ProducerSubtotal: 16.49,
		ProducerFee:      3.30,
		ProducerTotal:    19.78,
		TaxCost:          1.07,
		StripeCost:       0.49,
		VoxetiCost:       0.82,
		Total:            22.17,
	}

	if estimate != expected {
		t.Logf("%+v\n", expected)
		t.Logf("%+v\n", estimate)
		t.Errorf("EstimatePrice = %f; want %f", estimate.Total, expected.Total)
	}
}

func TestMultipleEstimates(t *testing.T) {
	var tests = []struct {
		name      string
		job       schema.Job
		sliceData schema.SliceData
		expected  schema.EstimateBreakdown
	}{
		{"BottomWithFinger.stl PLA", schema.Job{
			Filament: schema.PLA,
		}, schema.SliceData{
			Flavor:            "Marlin",
			TimeS:             6093,
			FilamentUsed:      2.326,
			LayerHeight:       0.2,
			MinX:              92.052,
			MinY:              91.423,
			MinZ:              0.3,
			MaxX:              143.78,
			MaxY:              143.575,
			MaxZ:              61.9,
			TargetMachineName: "Creality Ender 3",
		}, schema.EstimateBreakdown{
			BaseCost:         1.00,
			TimeCost:         5.08,
			FilamentCost:     0.21,
			ShippingCost:     10.20,
			ProducerSubtotal: 16.49,
			ProducerFee:      3.30,
			ProducerTotal:    19.78,
			TaxCost:          1.07,
			StripeCost:       0.49,
			VoxetiCost:       0.82,
			Total:            22.17,
		}},
		{"BottomWithFinger.stl ABS", schema.Job{
			Filament: schema.ABS,
		}, schema.SliceData{
			Flavor:            "Marlin",
			TimeS:             6093,
			FilamentUsed:      2.326,
			LayerHeight:       0.2,
			MinX:              92.052,
			MinY:              91.423,
			MinZ:              0.3,
			MaxX:              143.78,
			MaxY:              143.575,
			MaxZ:              61.9,
			TargetMachineName: "Creality Ender 3",
		}, schema.EstimateBreakdown{
			BaseCost:         1.00,
			TimeCost:         5.08,
			FilamentCost:     0.16,
			ShippingCost:     10.20,
			ProducerSubtotal: 16.44,
			ProducerFee:      3.29,
			ProducerTotal:    19.73,
			TaxCost:          1.07,
			StripeCost:       0.49,
			VoxetiCost:       0.82,
			Total:            22.11,
		}},
		{"BottomWithFinger.stl TPE", schema.Job{
			Filament: schema.TPE,
		}, schema.SliceData{
			Flavor:            "Marlin",
			TimeS:             6093,
			FilamentUsed:      2.326,
			LayerHeight:       0.2,
			MinX:              92.052,
			MinY:              91.423,
			MinZ:              0.3,
			MaxX:              143.78,
			MaxY:              143.575,
			MaxZ:              61.9,
			TargetMachineName: "Creality Ender 3",
		}, schema.EstimateBreakdown{
			BaseCost:         1.00,
			TimeCost:         5.08,
			FilamentCost:     0.28,
			ShippingCost:     10.20,
			ProducerSubtotal: 16.56,
			ProducerFee:      3.31,
			ProducerTotal:    19.87,
			TaxCost:          1.08,
			StripeCost:       0.50,
			VoxetiCost:       0.83,
			Total:            22.27,
		}},
		{"BladeInvertedSpearOfHeaven.stl", schema.Job{
			Filament: schema.PLA,
		}, schema.SliceData{
			Flavor:            "Marlin",
			TimeS:             2106,
			FilamentUsed:      0.735,
			LayerHeight:       0.2,
			MinX:              -94.299,
			MinY:              247.503,
			MinZ:              0.3,
			MaxX:              -45.298,
			MaxY:              251.503,
			MaxZ:              77.9,
			TargetMachineName: "Creality Ender 3",
		}, schema.EstimateBreakdown{
			BaseCost:         1.00,
			TimeCost:         1.75,
			FilamentCost:     0.07,
			ShippingCost:     10.20,
			ProducerSubtotal: 13.02,
			ProducerFee:      2.60,
			ProducerTotal:    15.63,
			TaxCost:          0.85,
			StripeCost:       0.39,
			VoxetiCost:       0.65,
			Total:            17.51,
		}},
	}

	for _, tt := range tests {
		testname := tt.name
		t.Run(testname, func(t *testing.T) {
			estimate, _ := EstimatePrice(tt.job, tt.sliceData, config)
			if estimate != tt.expected {
				t.Logf("%+v\n", tt.expected)
				t.Logf("%+v\n", estimate)
				t.Errorf("EstimatePrice = %f; want %f", estimate.Total, tt.expected.Total)
			}
		})
	}
}
