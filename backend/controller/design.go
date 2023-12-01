package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"voxeti/backend/schema"
	"voxeti/backend/schema/design"
	"voxeti/backend/utilities"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
)

func RegisterDesignHandlers(e *echo.Group, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/designs")

	// initialize GridFS bucket
	db := dbClient.Database("designs")
	bucket, err := gridfs.NewBucket(db)
	if err != nil {
		logger.Info("Failed to initialize the design file store!")
		os.Exit(1)
	}

	api.POST("", func(c echo.Context) error {
		// Extract the file from the request:
		form, err := c.MultipartForm()
		if err != nil {
			return c.JSON(utilities.CreateErrorResponse(400, "Unable to parse form!"))
		}

		// Extract the list of files:
		files := form.File["files"]

		// Extract the list of dimensions:
		dimensions := form.Value["dimensions"]

		if len(dimensions) != len(files) {
			return c.JSON(utilities.CreateErrorResponse(400, "Length of dimensions array and file array do not match!"))
		}

		if len(files) == 0 {
			return c.JSON(utilities.CreateErrorResponse(400, "No files have been provided!"))
		}

		// Instantiate Design Array:
		var designs []schema.Design

		// Validate each file:
		for _, file := range files {
			// Check to make sure the file does not exceed 20MB:
			if file.Size > (1000 * 1000 * 50) {
				return c.JSON(utilities.CreateErrorResponse(400, "STL file exceeds the 50MB file limit"))
			}

			// Validate STL file:
			validationErr := design.ValidateSTLFile(file)
			if validationErr != nil {
				return c.JSON(utilities.CreateErrorResponse(validationErr.Code, validationErr.Message))
			}
		}

		// Upload each file:
		for index, file := range files {
			// Retrieve file dimensions:
			dimensionString := dimensions[index]

			var dimensions schema.Dimensions
			err := json.Unmarshal([]byte(dimensionString), &dimensions)
			if err != nil {
				return c.JSON(utilities.CreateErrorResponse(400, dimensionString))
			}

			// Add STL file to DB:
			uploadErr, design := design.UploadSTLFile(file, bucket, dimensions)
			if uploadErr != nil {
				return c.JSON(utilities.CreateErrorResponse(uploadErr.Code, uploadErr.Message))
			}

			designs = append(designs, *design)
		}

		// Return file id as response:
		return c.JSON(http.StatusOK, designs)
	})

	api.GET("/:id", func(c echo.Context) error {
		// Retrieve query param:
		id := c.Param("id")

		// Call Retrieve Method:
		retrievalErr, designBytes := design.GetSTLFile(id, bucket)
		if retrievalErr != nil {
			return c.JSON(utilities.CreateErrorResponse(retrievalErr.Code, retrievalErr.Message))
		}

		// Set response headers:
		c.Response().Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=voxeti-%s.stl", id))
		c.Response().Header().Set("Content-Type", "application/octet-stream")
		c.Response().Header().Set("Content-Length", fmt.Sprint(len(*designBytes)))

		if _, err := c.Response().Write(*designBytes); err != nil {
			return c.JSON(utilities.CreateErrorResponse(500, "Failed to attach STL design to request!"))
		}

		return nil
	})

	api.DELETE("/:id", func(c echo.Context) error {
		// Retrieve query param:
		id := c.Param("id")

		// Call Delete Method:
		deleteErr := design.DeleteSTLFile(id, bucket)
		if deleteErr != nil {
			return c.JSON(utilities.CreateErrorResponse(deleteErr.Code, deleteErr.Message))
		}

		// Return success / failure:
		return c.NoContent(http.StatusOK)
	})
}
