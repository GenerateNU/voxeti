package main

import (
	"regexp"
	"testing"
)

func TestBasic(t *testing.T) {
	expectedString := "test"
	want := regexp.MustCompile(`\b` + expectedString + `\b`)
	actualString := "test"
	if !want.MatchString(actualString) {
		t.Fatalf(`Actual = %q, expected = %#q`, actualString, want)
	}
}
