package files

import (
	"bufio"
	"mime/multipart"
	"strings"
	"voxeti/backend/model"

	// "github.com/pterm/pterm"
	"github.com/pterm/pterm"
)

func ValidateSTLFile(file *multipart.FileHeader) model.ErrorResponse {
	// Open the STL File: 
	src, err := file.Open()
	if err != nil {
		return model.ErrorResponse{Code: 500, Message: "Failed to open the STL File!"}
	}
	defer src.Close()

	// Parse the first 5 bytes to check if the file is ASCII or binary:
	firstBytes := make([]byte, 5)
	_, err = src.Read(firstBytes)
	if err != nil {
		return model.ErrorResponse{Code: 500, Message: "Failed to read STL file!"}
	}

	// Determine which method to call:
	if string(firstBytes) == "solid" {
		// Validate an ASCII file:
		if err := ValidateASCIISTLFile(src, file.Size); err.Code != 0 {
			return err;
		}
	} else {
		// Validate a binary file:
		if err := ValidateASCIISTLFile(src, file.Size); err.Code != 0 {
			return err;
		}
	}
	// Return success:
	return model.ErrorResponse{}
}	

func ValidateBinarySTLFile(file multipart.File, size int64) model.ErrorResponse {
	return model.ErrorResponse{}
}

func ValidateASCIISTLFile(file multipart.File, size int64) model.ErrorResponse {
	// Check file size:
	if size < 15 {
		return model.ErrorResponse{Code: 400, Message: "ASCII file is too small!"}
	}

	scanner := bufio.NewScanner(file)
	lineNumber := 1
	seenEndSolid := false
	for scanner.Scan() {
		pterm.Println(scanner.Text())
		// Check to make sure the end of the file is the true end:
		if seenEndSolid {
			return model.ErrorResponse{Code: 400, Message: "Invalid STL ASCII File, extra line after endsolid!"}
		}
		// Line 2 must begin with "facet" or "endsolid"
		if lineNumber == 2 {
			if strings.HasPrefix(strings.Trim(scanner.Text(), " "), "endsolid") {
				seenEndSolid = true
				continue
			} else if !strings.HasPrefix(strings.Trim(scanner.Text(), " "), "facet") {
				return model.ErrorResponse{Code: 400, Message: "Invalid STL ASCII File, line 2 missing facet!"}
			}
		}
		// Locate end of file:
		if strings.HasPrefix(strings.Trim(scanner.Text(), " "), "endsolid") {
			seenEndSolid = true
			continue
		}
		lineNumber += 1
	}

	// Check if the end of the file was found:
	if !seenEndSolid {
		return model.ErrorResponse{Code: 400, Message: "Invalid STL ASCII File, end of file not found!"}
	} else {
		return model.ErrorResponse{}
	}
}
