package controller

import (
	"fmt"
	"net/http"
	"os"
	"voxeti/backend/schema/design"

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
		file, err := c.FormFile("file")
		if err != nil {
			return c.JSON(CreateErrorResponse(400, "No file has been provided to the request"))
		}

		// Check to make sure the file does not exceed 20MB:
		if file.Size > (1000 * 1000 * 20) {
			return c.JSON(CreateErrorResponse(400, "STL file exceeds the 20MB file limit"))
		}

		// Validate STL file:
		validationErr := design.ValidateSTLFile(file)
		if validationErr != nil {
			return c.JSON(CreateErrorResponse(validationErr.Code, validationErr.Message))
		}

		// Add STL file to DB:
		uploadErr, design := design.UploadSTLFile(file, bucket)
		if uploadErr != nil {
			return c.JSON(CreateErrorResponse(uploadErr.Code, uploadErr.Message))
		}

		// Return file as response:
		return c.JSON(http.StatusOK, design)
	})

	api.GET("/:id", func(c echo.Context) error {
		// Retrieve query param:
		id := c.Param("id")

		// Call Retrieve Method:
		retrievalErr, designBytes := design.GetSTLFile(id, bucket)
		if retrievalErr != nil {
			return c.JSON(CreateErrorResponse(retrievalErr.Code, retrievalErr.Message))
		}

		// Set response headers:
		c.Response().Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=voxeti-%s.stl", id))
		c.Response().Header().Set("Content-Type", "application/octet-stream")
		c.Response().Header().Set("Content-Length", fmt.Sprint(len(*designBytes)))

		if _, err := c.Response().Write(*designBytes); err != nil {
			return c.JSON(CreateErrorResponse(500, "Failed to attach STL design to request!"))
		}

		return nil
	})

	api.DELETE("/:id", func(c echo.Context) error {
		// Retrieve query param:
		id := c.Param("id")

		// Call Delete Method:
		deleteErr := design.DeleteSTLFile(id, bucket)
		if deleteErr != nil {
			return c.JSON(CreateErrorResponse(deleteErr.Code, deleteErr.Message))
		}

		return c.NoContent(http.StatusOK)
	})
}
