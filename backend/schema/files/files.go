package files

import (
	"bufio"
	"encoding/binary"

	"io"
	"mime/multipart"
	"strings"
	"voxeti/backend/schema"
)

func ValidateSTLFile(file *multipart.FileHeader) *schema.ErrorResponse {
	errorResponse := &schema.ErrorResponse{}

	// Open the STL File:
	src, err := file.Open()
	if err != nil {
		errorResponse.Code = 500
		errorResponse.Message = "Failed to open the STL File!";
		return errorResponse
	}
	defer src.Close()

	// Parse the first 5 bytes to check if the file is ASCII or binary:
	firstBytes := make([]byte, 5)
	_, err = src.Read(firstBytes)
	if err != nil {
		errorResponse.Code = 500
		errorResponse.Message =  "Failed to read STL file!";
		return errorResponse
	}

	// Determine which method to call:
	if string(firstBytes) == "solid" {
		// Validate an ASCII file:
		if err := ValidateASCIISTLFile(src, file.Size); err != nil{
			return err
		}
	} else {
		// Validate a binary file:
		if err := ValidateBinarySTLFile(src, file.Size); err != nil {
			return err
		}
	}
	// Return success:
	return nil
}

func ValidateBinarySTLFile(file multipart.File, size int64) *schema.ErrorResponse {
	errorResponse := &schema.ErrorResponse{}

	// Check file size:
	if size < 84 {
		errorResponse.Code = 400;
		errorResponse.Message =  "Binary file is too small!";
		return errorResponse;
	}

	// Set current read to the 80th byte:
	_, err := file.Seek(80, io.SeekStart)
	if err != nil {
		errorResponse.Code = 400;
		errorResponse.Message =  "Unable to read bytes after binary file header!";
		return errorResponse;
	}

	// Read the number of triangles in bits:
	triangleBytes := make([]byte, 4)
	_, err = file.Read(triangleBytes)
	if err != nil {
		errorResponse.Code = 500
		errorResponse.Message =  "Failed to read triangle bytes from binary STL file!";
		return errorResponse
	}

	// Convert bits to little-endian unsigned int32:
	numberOfTriangles := binary.LittleEndian.Uint32(triangleBytes)
	computedFileSize := 84 + (numberOfTriangles * 50)
	
	// Confirm file size matches number of triangles + header:
	if size != int64(computedFileSize) {
		errorResponse.Code = 400
		errorResponse.Message =  "Invalid binary file!";
		return errorResponse
	}

	return nil;
}

func ValidateASCIISTLFile(file multipart.File, size int64) *schema.ErrorResponse {
	errorResponse := &schema.ErrorResponse{}

	// Check file size:
	if size < 15 {
		errorResponse.Code = 400;
		errorResponse.Message =  "ASCII file is too small!";
		return errorResponse;
	}

	scanner := bufio.NewScanner(file)
	lineNumber := 1
	seenEndSolid := false
	for scanner.Scan() {
		// Check to make sure the end of the file is the true end:
		if seenEndSolid {
			errorResponse.Code = 400;
			errorResponse.Message =  "Invalid STL ASCII File, extra line after endsolid!";
			return errorResponse;
		}
		// Line 2 must begin with "facet" or "endsolid"
		if lineNumber == 2 {
			if strings.HasPrefix(strings.Trim(scanner.Text(), " "), "endsolid") {
				seenEndSolid = true
				continue
			} else if !strings.HasPrefix(strings.Trim(scanner.Text(), " "), "facet") {
				errorResponse.Code = 400;
				errorResponse.Message =  "Invalid STL ASCII File, line 2 missing facet!";
				return errorResponse;
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
		errorResponse.Code = 400;
		errorResponse.Message = "Invalid STL ASCII File, end of file not found!";
		return errorResponse;
	} else {
		return nil
	}
}
