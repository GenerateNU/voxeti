package slicer

import (
	"strings"
	"testing"
	"voxeti/backend/schema"
)

var config = LoadEstimateConfig("../../..")

/* schema.EstimateConfig{
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
} */

func TestLoadConfig(t *testing.T) {
	loadedConfig := LoadEstimateConfig("../../..")

	expectedConfig := schema.EstimateConfig{
		BaseCost:   1.00,
		HourlyCost: 3.00,
		FilamentCost: map[string]float32{
			strings.ToLower(schema.PLA): 0.09,
			strings.ToLower(schema.ABS): 0.07,
			strings.ToLower(schema.TPE): 0.12,
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

	if loadedConfig.BaseCost != expectedConfig.BaseCost {
		t.Logf("%+v\n", expectedConfig)
		t.Logf("%+v\n", loadedConfig)
		t.Errorf("BaseCost (%f) is different from expected (%f)", loadedConfig.BaseCost, expectedConfig.BaseCost)
	}

	if loadedConfig.HourlyCost != expectedConfig.HourlyCost {
		t.Logf("%+v\n", expectedConfig)
		t.Logf("%+v\n", loadedConfig)
		t.Errorf("HourlyCost (%f) is different from expected (%f)", loadedConfig.HourlyCost, expectedConfig.HourlyCost)
	}

	if len(loadedConfig.FilamentCost) != len(expectedConfig.FilamentCost) {
		t.Logf("%+v\n", expectedConfig)
		t.Logf("%+v\n", loadedConfig)
		t.Errorf("FilamentCost length (%d) is different from expected (%d)", len(loadedConfig.FilamentCost), len(expectedConfig.FilamentCost))
	}

	for k, v := range loadedConfig.FilamentCost {
		if expectedConfig.FilamentCost[k] != v {
			t.Errorf("FilamentCost keyvalue (%f) is different from expected (%f)", v, expectedConfig.FilamentCost[k])
		}
	}

	if len(loadedConfig.ShippingRate) != len(expectedConfig.ShippingRate) {
		t.Logf("%+v\n", expectedConfig)
		t.Logf("%+v\n", loadedConfig)
		t.Errorf("ShippingRate length (%d) is different from expected (%d)", len(loadedConfig.ShippingRate), len(expectedConfig.ShippingRate))
	}

	for k, v := range loadedConfig.ShippingRate {
		if expectedConfig.ShippingRate[k] != v {
			t.Errorf("ShippingRate keyvalue (%f) is different from expected (%f)", v, expectedConfig.ShippingRate[k])
		}
	}

	if loadedConfig.TaxRate != expectedConfig.TaxRate {
		t.Logf("%+v\n", expectedConfig)
		t.Logf("%+v\n", loadedConfig)
		t.Errorf("TaxRate (%f) is different from expected (%f)", loadedConfig.TaxRate, expectedConfig.TaxRate)
	}

	if loadedConfig.ProducerFee != expectedConfig.ProducerFee {
		t.Logf("%+v\n", expectedConfig)
		t.Logf("%+v\n", loadedConfig)
		t.Errorf("ProducerFee (%f) is different from expected (%f)", loadedConfig.ProducerFee, expectedConfig.ProducerFee)
	}

	if loadedConfig.StripeFee != expectedConfig.StripeFee {
		t.Logf("%+v\n", expectedConfig)
		t.Logf("%+v\n", loadedConfig)
		t.Errorf("StripeFee (%f) is different from expected (%f)", loadedConfig.StripeFee, expectedConfig.StripeFee)
	}

	if loadedConfig.VoxetiFee != expectedConfig.VoxetiFee {
		t.Logf("%+v\n", expectedConfig)
		t.Logf("%+v\n", loadedConfig)
		t.Errorf("VoxetiFee (%f) is different from expected (%f)", loadedConfig.VoxetiFee, expectedConfig.VoxetiFee)
	}
}

func TestEstimation(t *testing.T) {
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

	estimate, _ := EstimatePrice(schema.PLA, sliceData, config)

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
		filament  schema.FilamentType
		sliceData schema.SliceData
		expected  schema.EstimateBreakdown
	}{
		{"BottomWithFinger.stl PLA", schema.PLA,
			schema.SliceData{
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
		{"BottomWithFinger.stl ABS", schema.ABS,
			schema.SliceData{
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
		{"BottomWithFinger.stl TPE", schema.TPE,
			schema.SliceData{
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
		{"BladeInvertedSpearOfHeaven.stl", schema.PLA,
			schema.SliceData{
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
			estimate, _ := EstimatePrice(tt.filament, tt.sliceData, config)
			if estimate != tt.expected {
				t.Logf("%+v\n", tt.expected)
				t.Logf("%+v\n", estimate)
				t.Errorf("EstimatePrice = %f; want %f", estimate.Total, tt.expected.Total)
			}
		})
	}
}
