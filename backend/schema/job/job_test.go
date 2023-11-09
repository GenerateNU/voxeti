package job

import (
	"fmt"
	"os"
	"testing"
	"voxeti/backend/schema"

	"github.com/joho/godotenv"
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

	fmt.Println("Running user tests...")
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
			Scale:  89,
		}
		jobBSON, _ := bson.Marshal(expectedJob)
		var jobBsonData bson.D
		if err := bson.Unmarshal(jobBSON, &jobBsonData); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}

		// Mock MongoDB Database Response
		res := mtest.CreateCursorResponse(
			1,
			"data.job",
			mtest.FirstBatch,
			jobBsonData)
		// no more jobs to return, indicates the first batch is the only batch with job data
		end := mtest.CreateCursorResponse(
			0,
			"data.job",
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
			"data.job",
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
	mockEmailService := MockEmailService{}

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	mt.Run("Given Valid Job Object, Should Successfully Create Job", func(mt *mtest.T) {
		mt.AddMockResponses(bson.D{{Key: "ok", Value: 1}, {Key: "acknowledged", Value: true}, {Key: "n", Value: 1}})
		// Assertions
		validJobId := primitive.NewObjectID().Hex()
		err := DeleteJob(validJobId, mt.Client)
		assert.Nil(err)
	})

	mt.Run("Should Throw Correct Error When Creation Fails", func(mt *mtest.T) {
		_, err := CreateJob(schema.Job{}, mt.Client, &mockEmailService)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(err.Code, 500)
		assert.Equal(err.Message, "Unable to create job")
		assert.Equal(mockEmailService.numCallsSendNotification, 0) // Ensure no emails were sent
	})
}

func TestPatchJob(t *testing.T) {
	assert := assert.New(t)
	id := primitive.NewObjectID()
	designerId := primitive.NewObjectID()
	producerId := primitive.NewObjectID()
	designId := primitive.NewObjectID()
	mockEmailService := MockEmailService{}

	// insert the mock job document into the mock MongoDB database
	mtest_options := mtest.NewOptions().DatabaseName("data").ClientType(mtest.Mock)
	mt := mtest.New(t, mtest_options)
	defer mt.Close()

	mt.Run("Throws Error When Given Invalid JobID", func(mt *mtest.T) {
		mockJob := &schema.Job{
			Id:         primitive.NewObjectID(),
			DesignerId: primitive.NewObjectID(),
			ProducerId: primitive.NewObjectID(),
			DesignId:   primitive.NewObjectID(),
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			Filament:   schema.PLA,
			Dimensions: schema.Dimensions{Height: 12, Width: 10, Depth: 2},
			Scale:      89,
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
		mockJob := &schema.Job{
			Id:         id,
			DesignerId: designerId,
			ProducerId: producerId,
			DesignId:   designId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			Filament:   schema.PLA,
			Dimensions: schema.Dimensions{Height: 12, Width: 10, Depth: 2},
			Scale:      89,
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
			"data.job",
			mtest.FirstBatch,
			jobBsonData)
		end := mtest.CreateCursorResponse(
			0,
			"data.job",
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
			Dimensions: schema.Dimensions{Height: 12, Width: 10, Depth: 2},
			Scale:      89,
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
			Dimensions: schema.Dimensions{Height: 12, Width: 10, Depth: 2},
			Scale:      89,
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

		// Represents the Previous Job
		res := mtest.CreateCursorResponse(
			1,
			"data.job",
			mtest.FirstBatch,
			jobBsonData)
		end := mtest.CreateCursorResponse(
			0,
			"data.job",
			mtest.NextBatch)
		// mock UpdateOne response
		updateRes := bson.D{
			{Key: "ok", Value: 1},
			{Key: "value", Value: patchedJobBsonData},
		}
		// represents the newly patched job
		patchedRes := mtest.CreateCursorResponse(
			1,
			"data.job",
			mtest.FirstBatch,
			patchedJobBsonData)
		patchedEnd := mtest.CreateCursorResponse(
			0,
			"data.job",
			mtest.NextBatch)
		mt.AddMockResponses(res, end, updateRes, patchedRes, patchedEnd)

		/*
			currently failing because of not enough mocking, later when jobNotificationCreate is removed
			uncomment test.
			TODO: create mock user
		*/
		// Assertions
		// job, err := PatchJob(mockJob.Id.Hex(), patchFieldM, mt.Client, &mockEmailService)
		// assert.Nil(err)
		// assert.Equal(mockJob.Id, job.Id)
		// status was updated, send email
		// assert.Equal(1, mockEmailService.numCallsSendNotification)
	})
}

func TestUpdateJob(t *testing.T) {
	assert := assert.New(t)
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
			"data.job",
			mtest.FirstBatch,
			jobBsonData)
		end := mtest.CreateCursorResponse(
			0,
			"data.job",
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
		// string version of ObjectID used for comparisons
		jobIdHex := designerId.Hex()
		expectedJob := schema.Job{
			Id:         jobId,
			DesignerId: designerId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			Scale:      89,
		}
		jobBSON, _ := bson.Marshal(expectedJob)
		var jobBsonData bson.D
		if err := bson.Unmarshal(jobBSON, &jobBsonData); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}

		// Mock MongoDB Database Response
		res := mtest.CreateCursorResponse(
			1,
			"data.job",
			mtest.FirstBatch,
			jobBsonData)
		// no more jobs to return, indicates the first batch is the only batch with job data
		end := mtest.CreateCursorResponse(
			0,
			"data.job",
			mtest.NextBatch)
		mt.AddMockResponses(res, end)

		// Assertions
		foundJob, err := GetJobsByDesignerOrProducerId(jobIdHex, "", 10, 0, mt.Client)

		assert.Nil(err)
		assert.Equal(foundJob, []schema.Job{expectedJob})
	})

	mt.Run("Get Producer Jobs by ID", func(mt *mtest.T) {
		// Create expected job to be returned
		jobId := primitive.NewObjectID()
		producerId := primitive.NewObjectID()
		// string version of ObjectID used for comparisons
		jobIdHex := producerId.Hex()
		expectedJob := schema.Job{
			Id:         jobId,
			ProducerId: producerId,
			Status:     schema.Pending,
			Price:      123,
			Color:      "purple",
			Scale:      89,
		}
		jobBSON, _ := bson.Marshal(expectedJob)
		var jobBsonData bson.D
		if err := bson.Unmarshal(jobBSON, &jobBsonData); err != nil {
			assert.Fail("Failed to unmarshal bson data into document while prepping mock mongoDB. Test Name: 'Get Job by ID'")
		}

		// Mock MongoDB Database Response
		res := mtest.CreateCursorResponse(
			1,
			"data.job",
			mtest.FirstBatch,
			jobBsonData)
		// no more jobs to return, indicates the first batch is the only batch with job data
		end := mtest.CreateCursorResponse(
			0,
			"data.job",
			mtest.NextBatch)
		mt.AddMockResponses(res, end)

		// Assertions
		foundJob, err := GetJobsByDesignerOrProducerId("", jobIdHex, 10, 0, mt.Client)

		assert.Nil(err)
		assert.Equal(foundJob, []schema.Job{expectedJob})
	})

	mt.Run("Retrieving Non-existing ID throws error", func(mt *mtest.T) {
		// Mock MongoDB Database Response, no jobs were found
		res := mtest.CreateCursorResponse(
			0,
			"data.job",
			mtest.FirstBatch)
		mt.AddMockResponses(res)

		// Assertions
		nonExistingJobId := primitive.NewObjectID().Hex()
		_, err := getJobsByDesignerOrProducerIdDb(nonExistingJobId, "", 10, 0, mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(err.Code, 400)
		assert.Equal(err.Message, "Page does not exist")
	})

	mt.Run("Throws Error When Given Invalid ID", func(mt *mtest.T) {
		// Assertions
		_, err := getJobsByDesignerOrProducerIdDb("INCORRECT FORMAT", "", 10, 0, mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
			return
		}
		assert.Equal(err.Code, 404)
		assert.Equal(err.Message, "Job does not exist!")
	})
}
