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

		if err := files.ValidateSTLFile(file); err.Code != 0 {
			return c.JSON(CreateErrorResponse(err.Code, err.Message))
		}

		return c.String(http.StatusOK, "You have provided a valid STL file!")
	})

	api.GET("/retrieve-stl", func(c echo.Context) error {
		return errors.New("Weee")
	})
}
