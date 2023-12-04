package job

import (
	"fmt"
	"os"
	"testing"
	"voxeti/backend/schema"

	"github.com/joho/godotenv"
	"github.com/paulmach/orb"
	"github.com/paulmach/orb/geojson"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

type MockEmailService struct {
	numCallsSendNotification int
}

func (mockEmailService *MockEmailService) SendNotification(email *schema.Email) *schema.ErrorResponse {
	mockEmailService.numCallsSendNotification = mockEmailService.numCallsSendNotification + 1
	return nil
}

func TestMain(m *testing.M) {
	if err := godotenv.Load("../../../.env"); err != nil {
		fmt.Println("Failed to load environment variables from .env file")
	}

	fmt.Println("Running job tests...")
	os.Exit(m.Run())
}

func TestGetJobById(t *testing.T) {
	assert := assert.New(t)

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	mt.Run("Get Job by ID", func(mt *mtest.T) {
		// Create expected job to be returned
		jobId := primitive.NewObjectID()
		// string version of ObjectID used for comparisons
		jobIdHex := jobId.Hex()
		expectedJob := schema.Job{
			Id:     jobId,
			Status: schema.Pending,
			Price:  123,
			Color:  "purple",
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		jobBSON, _ := bson.Marshal(expectedJob)
		var jobBsonData bson.D
		if err := bson.Unmarshal(jobBSON, &jobBsonData); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}

		// Mock MongoDB Database Response
		res := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			jobBsonData)
		// no more jobs to return, indicates the first batch is the only batch with job data
		end := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.NextBatch)
		mt.AddMockResponses(res, end)

		// Assertions
		foundJob, err := GetJobById(jobIdHex, mt.Client)
		assert.Nil(err)
		assert.Equal(foundJob, expectedJob)
	})

	mt.Run("Retrieving Non-existing ID throws error", func(mt *mtest.T) {
		// Mock MongoDB Database Response, no jobs were found
		res := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.FirstBatch)
		mt.AddMockResponses(res)

		// Assertions
		nonExistingJobId := primitive.NewObjectID().Hex()
		_, err := GetJobById(nonExistingJobId, mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(err.Code, 404)
		assert.Equal(err.Message, "Job does not exist!")
	})

	mt.Run("Throws Error When Given Invalid Job ID", func(mt *mtest.T) {
		// Assertions
		_, err := GetJobById("INCORRECT FORMAT", mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(err.Code, 404)
		assert.Equal(err.Message, "Invalid JobId")
	})

}

func TestDeleteJob(t *testing.T) {
	assert := assert.New(t)

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	mt.Run("Given Valid JobID, Should Successfully Delete Job", func(mt *mtest.T) {
		mt.AddMockResponses(bson.D{{Key: "ok", Value: 1}, {Key: "acknowledged", Value: true}, {Key: "n", Value: 1}})
		// Assertions
		validJobId := primitive.NewObjectID().Hex()
		err := DeleteJob(validJobId, mt.Client)
		assert.Nil(err)
	})

	mt.Run("Throws Error When Given Invalid Job ID", func(mt *mtest.T) {
		// Assertions
		err := DeleteJob("INCORRECT FORMAT", mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(err.Code, 404)
		assert.Equal(err.Message, "Invalid JobId")
	})
}

func TestCreateJob(t *testing.T) {
	assert := assert.New(t)
	designerId := primitive.NewObjectID()
	producerId := primitive.NewObjectID()
	var designId []primitive.ObjectID
	designId = append(designId, primitive.NewObjectID())

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	mt.Run("Given Valid Job Object, Should Successfully Create Job", func(mt *mtest.T) {
		mockEmailService := MockEmailService{}

		job := &schema.Job{
			DesignerId: designerId,
			ProducerId: producerId,
			DesignId:   designId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			Filament:   schema.PLA,
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}

		user := schema.User{
			Id:             primitive.NewObjectID(),
			FirstName:      "Kevin",
			LastName:       "Durant",
			Email:          "kd35@gmail.com",
			Password:       "iamkevindurant",
			SocialProvider: "NONE",
			Addresses: []schema.Address{
				{
					Name:    "Home",
					Line1:   "35 Oklahoma St",
					Line2:   "Apt 1",
					ZipCode: "12345",
					City:    "Phoenix",
					State:   "AZ",
					Country: "USA",
					Location: geojson.Geometry{
						Type:        "Point",
						Coordinates: orb.Point{1, 1},
					},
				},
			},
			PhoneNumber: &schema.PhoneNumber{
				CountryCode: "1",
				Number:      "1234567890",
			},
			Experience: 1,
			Printers: []schema.Printer{
				{
					SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
					Dimensions: schema.Dimensions{
						Height: 10,
						Width:  10,
						Depth:  10,
					},
				},
			},
			AvailableFilament: []schema.Filament{
				{
					Type:         "PLA",
					Color:        "Red",
					PricePerUnit: 10,
				},
				{
					Type:         "ABS",
					Color:        "Blue",
					PricePerUnit: 10,
				},
			},
		}

		userBSON, _ := bson.Marshal(user)
		var bsonD bson.D
		err1 := bson.Unmarshal(userBSON, &bsonD)
		if err1 != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
		}

		userRes := mtest.CreateCursorResponse(
			1,
			"data.users",
			mtest.FirstBatch,
			bsonD)

		end := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.NextBatch)

		mt.AddMockResponses(mtest.CreateSuccessResponse(), userRes, end)

		// Assertions
		createdJob, err := CreateJob(*job, mt.Client, &mockEmailService)
		assert.Nil(err)
		assert.Equal(createdJob.DesignerId, job.DesignerId)
		assert.Equal(createdJob.ProducerId, job.ProducerId)
		assert.Equal(createdJob.DesignId, job.DesignId)
		assert.Equal(createdJob.Status, job.Status)
		assert.Equal(createdJob.Price, job.Price)
		assert.Equal(createdJob.Color, job.Color)
		assert.Equal(createdJob.Filament, job.Filament)
		// status was updated, send email
		assert.Equal(1, mockEmailService.numCallsSendNotification)
	})

	mt.Run("Should Throw Correct Error When Creation Fails", func(mt *mtest.T) {
		mockEmailService := MockEmailService{}

		_, err := CreateJob(schema.Job{}, mt.Client, &mockEmailService)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(500, err.Code)
		assert.Equal("Unable to create job", err.Message)
		assert.Equal(0, mockEmailService.numCallsSendNotification) // Ensure no emails were sent
	})
}

func TestPatchJob(t *testing.T) {
	assert := assert.New(t)
	id := primitive.NewObjectID()
	designerId := primitive.NewObjectID()
	producerId := primitive.NewObjectID()
	var designId []primitive.ObjectID
	designId = append(designId, primitive.NewObjectID())
	mockEmailService := MockEmailService{}

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	mt.Run("Throws Error When Given Invalid JobID", func(mt *mtest.T) {
		mockJob := &schema.Job{
			Id:         id,
			DesignerId: designerId,
			ProducerId: producerId,
			DesignId:   designId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			Filament:   schema.PLA,
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		// Convert mockJob to primitive.M
		mockJobMap, errMarshal := bson.Marshal(mockJob)
		if errMarshal != nil {
			assert.Fail("Failed to marshal mock job")
		}
		var mockJobM primitive.M
		if marshalErr := bson.Unmarshal(mockJobMap, &mockJobM); marshalErr != nil {
			assert.Fail("Failed to unmarshal mock job")
		}
		// Assertions
		_, err := PatchJob("INVALID JOB ID", mockJobM, mt.Client, &mockEmailService)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(err.Code, 404)
		assert.Equal(err.Message, "Invalid JobID")
		assert.Equal(mockEmailService.numCallsSendNotification, 0)
	})

	mt.Run("Successfully Updates and Returns Job", func(mt *mtest.T) {
		var designId []primitive.ObjectID
		designId = append(designId, primitive.NewObjectID())

		mockJob := &schema.Job{
			Id:         primitive.NewObjectID(),
			DesignerId: primitive.NewObjectID(),
			ProducerId: primitive.NewObjectID(),
			DesignId:   designId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			Filament:   schema.PLA,
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		// Convert mockJob to primitive.M
		mockJobMap, marshalerr := bson.Marshal(mockJob)
		if marshalerr != nil {
			assert.Fail("Failed to marshal mock job")
		}
		var mockJobM primitive.M
		if unmarshalErr := bson.Unmarshal(mockJobMap, &mockJobM); unmarshalErr != nil {
			assert.Fail("Failed to unmarshal mock job")
		}
		// Convert to bson.D
		jobBSON, _ := bson.Marshal(mockJob)
		var jobBsonData bson.D
		if unmarshalErr := bson.Unmarshal(jobBSON, &jobBsonData); unmarshalErr != nil {
			assert.Fail("Failed to unmarshal mock job")
		}

		// mock update response
		updateRes := bson.D{
			{Key: "ok", Value: 1},
			{Key: "value", Value: jobBsonData},
		}

		// Mock FindOne Response
		res := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			jobBsonData)
		end := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.NextBatch)
		mt.AddMockResponses(res, end, updateRes, res, end)

		// Assertions
		job, err := PatchJob(mockJob.Id.Hex(), mockJobM, mt.Client, &mockEmailService)
		assert.Nil(err)
		assert.Equal(mockJob.Id, job.Id)
		// status was not updated, do not send email
		assert.Equal(mockEmailService.numCallsSendNotification, 0)
	})

	mt.Run("Sends Email Notification After Updating Status Field", func(mt *mtest.T) {
		mockJob := &schema.Job{
			Id:         id,
			DesignerId: designerId,
			ProducerId: producerId,
			DesignId:   designId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			Filament:   schema.PLA,
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		patchedJob := &schema.Job{
			Id:         id,
			DesignerId: designerId,
			ProducerId: producerId,
			DesignId:   designId,
			Status:     schema.InProgress,
			Price:      123,
			Color:      "purple",
			Filament:   schema.PLA,
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}

		user := schema.User{
			Id:             primitive.NewObjectID(),
			FirstName:      "Kevin",
			LastName:       "Durant",
			Email:          "kd35@gmail.com",
			Password:       "iamkevindurant",
			SocialProvider: "NONE",
			Addresses: []schema.Address{
				{
					Name:    "Home",
					Line1:   "35 Oklahoma St",
					Line2:   "Apt 1",
					ZipCode: "12345",
					City:    "Phoenix",
					State:   "AZ",
					Country: "USA",
					Location: geojson.Geometry{
						Type:        "Point",
						Coordinates: orb.Point{1, 1},
					},
				},
			},
			PhoneNumber: &schema.PhoneNumber{
				CountryCode: "1",
				Number:      "1234567890",
			},
			Experience: 1,
			Printers: []schema.Printer{
				{
					SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
					Dimensions: schema.Dimensions{
						Height: 10,
						Width:  10,
						Depth:  10,
					},
				},
			},
			AvailableFilament: []schema.Filament{
				{
					Type:         "PLA",
					Color:        "Red",
					PricePerUnit: 10,
				},
				{
					Type:         "ABS",
					Color:        "Blue",
					PricePerUnit: 10,
				},
			},
		}

		userBSON, _ := bson.Marshal(user)
		var bsonD bson.D
		err1 := bson.Unmarshal(userBSON, &bsonD)
		if err1 != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
		}

		patchField := bson.M{"Status": schema.InProgress}
		// Prepare Patched Field
		patchFieldMap, marshalerr := bson.Marshal(patchField)
		if marshalerr != nil {
			assert.Fail("Failed to marshal mock job")
		}
		var patchFieldM primitive.M
		if unmarshalErr := bson.Unmarshal(patchFieldMap, &patchFieldM); unmarshalErr != nil {
			assert.Fail("Failed to unmarshal mock job")
		}

		// Previous Job
		jobBSON, _ := bson.Marshal(mockJob)
		var jobBsonData bson.D
		if unmarshalErr := bson.Unmarshal(jobBSON, &jobBsonData); unmarshalErr != nil {
			assert.Fail("Failed to unmarshal mock job")
		}

		// Patched Job
		patchedJobBSON, _ := bson.Marshal(patchedJob)
		var patchedJobBsonData bson.D
		if unmarshalErr := bson.Unmarshal(patchedJobBSON, &patchedJobBsonData); unmarshalErr != nil {
			assert.Fail("Failed to unmarshal patched job")
		}

		userRes := mtest.CreateCursorResponse(
			1,
			"data.users",
			mtest.FirstBatch,
			bsonD)

		// Represents the Previous Job
		res := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			jobBsonData)
		end := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.NextBatch)
		// mock UpdateOne response
		updateRes := bson.D{
			{Key: "ok", Value: 1},
			{Key: "value", Value: patchedJobBsonData},
		}
		// represents the newly patched job
		patchedRes := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			patchedJobBsonData)

		mt.AddMockResponses(res, end, updateRes, patchedRes, end, userRes, end)

		// Assertions
		job, err := PatchJob(mockJob.Id.Hex(), patchFieldM, mt.Client, &mockEmailService)
		assert.Nil(err)
		assert.Equal(mockJob.Id, job.Id)
		// status was updated, send email
		assert.Equal(1, mockEmailService.numCallsSendNotification)
	})
}

func TestUpdateJob(t *testing.T) {
	assert := assert.New(t)
	id := primitive.NewObjectID()
	designerId := primitive.NewObjectID()
	producerId := primitive.NewObjectID()
	var designId []primitive.ObjectID
	designId = append(designId, primitive.NewObjectID())

	mockEmailService := MockEmailService{}

	// Mock MongoDB setup
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	// Successfully update an existing job
	mt.Run("Successful Job Update", func(mt *mtest.T) {
		// Mock job data
		jobID := primitive.NewObjectID()
		existingJob := schema.Job{
			Id:     jobID,
			Status: schema.Pending,
			Price:  200,
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		updatedJob := existingJob
		updatedJob.Price = 250 // Change in the job's data

		// Convert to bson.D
		jobBSON, _ := bson.Marshal(existingJob)
		var jobBsonData bson.D
		if unmarshalErr := bson.Unmarshal(jobBSON, &jobBsonData); unmarshalErr != nil {
			assert.Fail("Failed to unmarshal mock job")
		}

		// mock update response
		updateRes := bson.D{
			{Key: "ok", Value: 1},
			{Key: "value", Value: jobBsonData},
		}

		// Mock FindOne Response
		res := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			jobBsonData)
		end := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.NextBatch)

		// Mock database responses
		mt.AddMockResponses(res, end, updateRes)

		// Assertions
		result, err := UpdateJob(jobID.Hex(), updatedJob, mt.Client, &mockEmailService)
		assert.Nil(err)
		assert.Equal(result.Price, updatedJob.Price)
	})

	// Attempt to update a job that doesn't exist
	mt.Run("Update Non-existing Job", func(mt *mtest.T) {
		nonExistingJobId := primitive.NewObjectID().Hex()
		update := schema.Job{}

		// Assertions
		_, err := UpdateJob(nonExistingJobId, update, mt.Client, &mockEmailService)
		if assert.NotNil(err) {
			assert.Contains(err.Message, "Job update failed")
		}
	})

	// Invalid Job ID format
	mt.Run("Invalid Job ID Format", func(mt *mtest.T) {
		invalidJobID := "invalidFormat"
		update := schema.Job{}

		// Assertions
		_, err := UpdateJob(invalidJobID, update, mt.Client, &mockEmailService)
		if assert.NotNil(err) {
			assert.Contains(err.Message, "Job does not exist!")
		}
	})

	mt.Run("Sends Email Notification After Updating Status Field", func(mt *mtest.T) {
		mockJob := &schema.Job{
			Id:         id,
			DesignerId: designerId,
			ProducerId: producerId,
			DesignId:   designId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			Filament:   schema.PLA,
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		patchedJob := &schema.Job{
			Id:         id,
			DesignerId: designerId,
			ProducerId: producerId,
			DesignId:   designId,
			Status:     schema.InProgress,
			Price:      123,
			Color:      "purple",
			Filament:   schema.PLA,
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}

		user := schema.User{
			Id:             primitive.NewObjectID(),
			FirstName:      "Kevin",
			LastName:       "Durant",
			Email:          "kd35@gmail.com",
			Password:       "iamkevindurant",
			SocialProvider: "NONE",
			Addresses: []schema.Address{
				{
					Name:    "Home",
					Line1:   "35 Oklahoma St",
					Line2:   "Apt 1",
					ZipCode: "12345",
					City:    "Phoenix",
					State:   "AZ",
					Country: "USA",
					Location: geojson.Geometry{
						Type:        "Point",
						Coordinates: orb.Point{1, 1},
					},
				},
			},
			PhoneNumber: &schema.PhoneNumber{
				CountryCode: "1",
				Number:      "1234567890",
			},
			Experience: 1,
			Printers: []schema.Printer{
				{
					SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
					Dimensions: schema.Dimensions{
						Height: 10,
						Width:  10,
						Depth:  10,
					},
				},
			},
			AvailableFilament: []schema.Filament{
				{
					Type:         "PLA",
					Color:        "Red",
					PricePerUnit: 10,
				},
				{
					Type:         "ABS",
					Color:        "Blue",
					PricePerUnit: 10,
				},
			},
		}

		userBSON, _ := bson.Marshal(user)
		var bsonD bson.D
		err1 := bson.Unmarshal(userBSON, &bsonD)
		if err1 != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Method: 'Success'")
		}

		patchField := bson.M{"Status": schema.InProgress}
		// Prepare Patched Field
		patchFieldMap, marshalerr := bson.Marshal(patchField)
		if marshalerr != nil {
			assert.Fail("Failed to marshal mock job")
		}
		var patchFieldM primitive.M
		if unmarshalErr := bson.Unmarshal(patchFieldMap, &patchFieldM); unmarshalErr != nil {
			assert.Fail("Failed to unmarshal mock job")
		}

		// Previous Job
		jobBSON, _ := bson.Marshal(mockJob)
		var jobBsonData bson.D
		if unmarshalErr := bson.Unmarshal(jobBSON, &jobBsonData); unmarshalErr != nil {
			assert.Fail("Failed to unmarshal mock job")
		}

		// Patched Job
		patchedJobBSON, _ := bson.Marshal(patchedJob)
		var patchedJobBsonData bson.D
		if unmarshalErr := bson.Unmarshal(patchedJobBSON, &patchedJobBsonData); unmarshalErr != nil {
			assert.Fail("Failed to unmarshal patched job")
		}

		userRes := mtest.CreateCursorResponse(
			1,
			"data.users",
			mtest.FirstBatch,
			bsonD)

		// Represents the Previous Job
		res := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			jobBsonData)
		end := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.NextBatch)
		// mock UpdateOne response
		updateRes := bson.D{
			{Key: "ok", Value: 1},
			{Key: "value", Value: patchedJobBsonData},
		}
		// represents the newly patched job
		patchedRes := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			patchedJobBsonData)

		mt.AddMockResponses(res, end, updateRes, patchedRes, end, userRes, end)

		// Assertions
		job, err := UpdateJob(mockJob.Id.Hex(), *patchedJob, mt.Client, &mockEmailService)
		assert.Nil(err)
		assert.Equal(mockJob.Id, job.Id)
		// status was updated, send email
		assert.Equal(1, mockEmailService.numCallsSendNotification)
	})
}

func TestGetJobsByDesignerOrProducerId(t *testing.T) {
	assert := assert.New(t)

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	mt.Run("Get Designer Jobs by ID", func(mt *mtest.T) {
		// Create expected job to be returned
		jobId := primitive.NewObjectID()
		designerId := primitive.NewObjectID()
		producerId, _ := primitive.ObjectIDFromHex("")
		// string version of ObjectID used for comparisons
		jobIdHex := designerId
		expectedJob := schema.JobView{
			Id:         jobId,
			DesignerId: designerId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
			DesignerFirstName: "Kevin",
			DesignerLastName:  "Durant",
			ProducerFirstName: "Lebron",
			ProducerLastName:  "James",
		}
		jobBSON, _ := bson.Marshal(expectedJob)
		var jobBsonData bson.D
		if err := bson.Unmarshal(jobBSON, &jobBsonData); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}

		// Mock MongoDB Database Response
		res := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			jobBsonData)
		// no more jobs to return, indicates the first batch is the only batch with job data
		end := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.NextBatch)
		mt.AddMockResponses(res, end)

		// Assertions
		foundJob, err := GetJobsByDesignerOrProducerId(jobIdHex, producerId, "", 10, 0, mt.Client)

		assert.Nil(err)
		assert.Equal(foundJob, []schema.JobView{expectedJob})
	})

	mt.Run("Get Producer Jobs by ID", func(mt *mtest.T) {
		// Create expected job to be returned
		jobId := primitive.NewObjectID()
		designerId, _ := primitive.ObjectIDFromHex("")
		producerId := primitive.NewObjectID()
		// string version of ObjectID used for comparisons
		jobIdHex := producerId
		expectedJob := schema.JobView{
			Id:         jobId,
			ProducerId: producerId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
			DesignerFirstName: "Kevin",
			DesignerLastName:  "Durant",
			ProducerFirstName: "Lebron",
			ProducerLastName:  "James",
		}
		jobBSON, _ := bson.Marshal(expectedJob)
		var jobBsonData bson.D
		if err := bson.Unmarshal(jobBSON, &jobBsonData); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}

		// Mock MongoDB Database Response
		res := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			jobBsonData)
		// no more jobs to return, indicates the first batch is the only batch with job data
		end := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.NextBatch)
		mt.AddMockResponses(res, end)

		// Assertions
		foundJob, err := GetJobsByDesignerOrProducerId(designerId, jobIdHex, "", 10, 0, mt.Client)

		assert.Nil(err)
		assert.Equal(foundJob, []schema.JobView{expectedJob})
	})

	mt.Run("Retrieving Non-existing ID throws error", func(mt *mtest.T) {
		// Mock MongoDB Database Response, no jobs were found
		res := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.FirstBatch)
		mt.AddMockResponses(res)

		// Assertions
		nonExistingDesignerId := primitive.NewObjectID()
		nonExistingProducerId, _ := primitive.ObjectIDFromHex("")
		_, err := getJobsByDesignerOrProducerIdDb(nonExistingDesignerId, nonExistingProducerId, "", 10, 0, mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(err.Code, 400)
		assert.Equal(err.Message, "Page does not exist")
	})

	mt.Run("Throws Error When Given Invalid ID", func(mt *mtest.T) {
		// Assertions
		nonExistingDesignerId, _ := primitive.ObjectIDFromHex("INCORRECT FORMAT")
		nonExistingProducerId, _ := primitive.ObjectIDFromHex("")
		_, err := getJobsByDesignerOrProducerIdDb(nonExistingDesignerId, nonExistingProducerId, "", 10, 0, mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(err.Code, 404)
		assert.Equal(err.Message, "Job does not exist!")
	})
}

func TestGetRecommendedJobs(t *testing.T) {
	assert := assert.New(t)

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	producerId := primitive.NewObjectID()
	job1Id := primitive.NewObjectID()
	job1DesignerId := primitive.NewObjectID()
	job2Id := primitive.NewObjectID()
	job2DesignerId := primitive.NewObjectID()
	job3Id := primitive.NewObjectID()
	job3DesignerId := primitive.NewObjectID()
	job4Id := primitive.NewObjectID()
	job4DesignerId := primitive.NewObjectID()

	mt.Run("Success - sort by price", func(mt *mtest.T) {
		user := schema.User{
			Id:             producerId,
			FirstName:      "Kevin",
			LastName:       "Durant",
			Email:          "kd35@gmail.com",
			Password:       "iamkevindurant",
			SocialProvider: "NONE",
			Addresses: []schema.Address{
				{
					Name:    "Home",
					Line1:   "35 Oklahoma St",
					Line2:   "Apt 1",
					ZipCode: "12345",
					City:    "Phoenix",
					State:   "AZ",
					Country: "USA",
					Location: geojson.Geometry{
						Type:        "Point",
						Coordinates: orb.Point{1, 1},
					},
				},
			},
			PhoneNumber: &schema.PhoneNumber{
				CountryCode: "1",
				Number:      "1234567890",
			},
			Experience: 1,
			Printers: []schema.Printer{
				{
					SupportedFilament: []schema.FilamentType{"PLA", "ABS"},
					Dimensions: schema.Dimensions{
						Height: 10,
						Width:  10,
						Depth:  10,
					},
				},
			},
			AvailableFilament: []schema.Filament{
				{
					Type:         "PLA",
					Color:        "Red",
					PricePerUnit: 10,
				},
				{
					Type:         "ABS",
					Color:        "Blue",
					PricePerUnit: 10,
				},
			},
		}

		// Create expected job to be returned
		expectedJob1 := schema.Job{
			Id:         job1Id,
			DesignerId: job1DesignerId,
			Status:     schema.Pending,
			Price:      1,
			Filament:   schema.PLA,
			Color:      "Red",
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		expectedJob2 := schema.Job{
			Id:         job2Id,
			DesignerId: job2DesignerId,
			Status:     schema.Pending,
			Price:      2,
			Filament:   schema.PLA,
			Color:      "Red",
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		expectedJob3 := schema.Job{
			Id:         job3Id,
			DesignerId: job3DesignerId,
			Status:     schema.Pending,
			Price:      3,
			Filament:   schema.PLA,
			Color:      "Red",
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		expectedJob4 := schema.Job{
			Id:         job4Id,
			DesignerId: job4DesignerId,
			Status:     schema.Pending,
			Price:      3,
			Filament:   schema.PLA,
			Color:      "Red",
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}
		userBSON, _ := bson.Marshal(user)
		jobBSON1, _ := bson.Marshal(expectedJob1)
		jobBSON2, _ := bson.Marshal(expectedJob2)
		jobBSON3, _ := bson.Marshal(expectedJob3)
		jobBSON4, _ := bson.Marshal(expectedJob4)
		var userBsonD bson.D
		var jobBsonData1 bson.D
		var jobBsonData2 bson.D
		var jobBsonData3 bson.D
		var jobBsonData4 bson.D
		if err := bson.Unmarshal(userBSON, &userBsonD); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}
		if err := bson.Unmarshal(jobBSON1, &jobBsonData1); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}
		if err := bson.Unmarshal(jobBSON2, &jobBsonData2); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}
		if err := bson.Unmarshal(jobBSON3, &jobBsonData3); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}
		if err := bson.Unmarshal(jobBSON4, &jobBsonData4); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}

		// Mock MongoDB Database Response

		userRes := mtest.CreateCursorResponse(
			1,
			"data.users",
			mtest.FirstBatch,
			userBsonD)

		userEnd := mtest.CreateCursorResponse(
			0,
			"data.users",
			mtest.NextBatch)

		potentialRes := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			jobBsonData1,
			jobBsonData2)

		filterRes := mtest.CreateCursorResponse(
			1,
			"data.jobs",
			mtest.FirstBatch,
			jobBsonData3,
			jobBsonData4)
		// no more jobs to return, indicates the first batch is the only batch with job data
		jobsEnd := mtest.CreateCursorResponse(
			0,
			"data.jobs",
			mtest.NextBatch)
		mt.AddMockResponses(potentialRes, jobsEnd, userRes, userEnd, filterRes, jobsEnd, mtest.CreateSuccessResponse(), mtest.CreateSuccessResponse())

		// Assertions
		recommendedJobs, err := GetRecommendedJobs(1, 10, "DISTANCE,SUPPORTEDFILAMENTTYPES,AVAILABLEFILAMENTTYPES,AVAILABLECOLORS", "PRICE", &producerId, mt.Client)

		assert.Nil(err)
		derefJobs := *recommendedJobs
		// check potential producer jobs returned first
		assert.Equal(derefJobs[0], expectedJob1)
		assert.Equal(derefJobs[1], expectedJob2)

		// check filtered jobs returned second and sorted by price
		for i := 2; i < len(derefJobs)-1; i++ {
			assert.True(derefJobs[i].Price <= derefJobs[i+1].Price)
		}
	})
}

func TestDeclineJob(t *testing.T) {
	assert := assert.New(t)

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	producerId := primitive.NewObjectID()
	jobId := primitive.NewObjectID()
	jobDesignerId := primitive.NewObjectID()

	mt.Run("Success - decline job", func(mt *mtest.T) {

		expectedJob := schema.Job{
			Id:         jobId,
			DesignerId: jobDesignerId,
			Status:     schema.Pending,
			Price:      1,
			Filament:   schema.PLA,
			Color:      "Red",
			ShippingAddress: schema.Address{
				Name:    "Home",
				Line1:   "35 Oklahoma St",
				Line2:   "Apt 1",
				ZipCode: "12345",
				City:    "Phoenix",
				State:   "AZ",
				Country: "USA",
				Location: geojson.Geometry{
					Type:        "Point",
					Coordinates: orb.Point{1, 1},
				},
			},
		}

		expectedJobBson, _ := bson.Marshal(expectedJob)
		var jobBsonD bson.D

		if err := bson.Unmarshal(expectedJobBson, &jobBsonD); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}

		// Mock MongoDB Database Response

		findOneAndUpdateRes := bson.D{
			{Key: "ok", Value: 1},
			{Key: "value", Value: jobBsonD},
		}

		mt.AddMockResponses(findOneAndUpdateRes, mtest.CreateSuccessResponse())

		// Assertions
		err := DeclineJob(jobId.Hex(), &producerId, mt.Client)

		assert.Nil(err)
	})
}

func TestAcceptJob(t *testing.T) {
	assert := assert.New(t)

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	producerId := primitive.NewObjectID()
	jobId := primitive.NewObjectID()

	mt.Run("Success - decline job", func(mt *mtest.T) {

		mt.AddMockResponses(mtest.CreateSuccessResponse(), mtest.CreateSuccessResponse())

		// Assertions
		err := AcceptJob(jobId.Hex(), &producerId, mt.Client)

		assert.Nil(err)
	})
}
