package controller

import (
	"errors"
	"net/http"
	"voxeti/backend/schema/files"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

func RegisterFilesHandlers(e *echo.Group, logger *pterm.Logger) {
	api := e.Group("/files")

	api.POST("/upload-stl", func(c echo.Context) error {
		// Extract the file from the request:
		file, err := c.FormFile("file")
		if err != nil {
			return c.JSON(CreateErrorResponse(400, "No file has been provided to the request"))
		}

		// Check to make sure the file does not exceed 20MB:
		if file.Size > (1000 * 1000 * 20) {
			return c.JSON(CreateErrorResponse(400, "STL file exceeds the 20MB file limit"))
		}

		validationErr := files.ValidateSTLFile(file)
		if err != nil {
			return c.JSON(CreateErrorResponse(validationErr.Code, validationErr.Message))
		}

		// Will need to be updated to return DB reference:
		return c.NoContent(http.StatusOK)
	})

	api.GET("/retrieve-stl", func(c echo.Context) error {
		return errors.New("Weee")
	})
}
