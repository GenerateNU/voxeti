package design

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
)

func UploadDesign(file *multipart.FileHeader, bucket *gridfs.Bucket) (*schema.ErrorResponse, *schema.Design) {
	errResponse := &schema.ErrorResponse{}
	design := &schema.Design{}

	// Open the STL file:
	src, err := file.Open()
	if err != nil {
		errResponse.Code = 500
		errResponse.Message = "Failed to open design!"
		return errResponse, nil
	}

	// Upload the file with metadata:
	objectID, err := bucket.UploadFromStream(file.Filename, io.Reader(src))
	if err != nil {
		errResponse.Code = 500
		errResponse.Message = "Failed to upload design!"
	}

	design.Id = objectID
	design.Name = fmt.Sprintf("voxeti-%s.stl", objectID.Hex())
	design.Length = file.Size

	return nil, design
}

func DeleteDesign(id string, bucket *gridfs.Bucket) *schema.ErrorResponse {
	errResponse := &schema.ErrorResponse{}

	// Convert the id to an ObjectID:
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		errResponse.Code = 500
		errResponse.Message = "Failed to convert design id to ObjectID"
		return errResponse
	}

	// Delete the file:
	if err = bucket.Delete(objectID); err != nil {
		errResponse.Code = 400
		errResponse.Message = err.Error()
		return errResponse
	}

	return nil
}

func GetDesign(id string, bucket *gridfs.Bucket) (*schema.ErrorResponse, *[]byte) {
	errResponse := &schema.ErrorResponse{}
	designBytes := &[]byte{}

	// Convert the id to an ObjectID:
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		errResponse.Code = 500
		errResponse.Message = "Failed to convert design id to ObjectID"
		return errResponse, nil
	}

	// Instantiate a new io.Writer:
	fileBuffer := bytes.NewBuffer(nil)

	// Download file from mongoDB:
	if _, err := bucket.DownloadToStream(objectID, fileBuffer); err != nil {
		errResponse.Code = 400
		errResponse.Message = err.Error()
	}

	*designBytes = fileBuffer.Bytes()
	return nil, designBytes
}
