package job

import (
	"context"
	"errors"
	"fmt"
	"testing"
	"voxeti/backend/schema"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

var (
	mockDB = map[string]*schema.Job{
		"someJobId1": {
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
		},
	}
)

type MockJobRepository struct {
	Jobs map[string]*schema.Job
}

func (m *MockJobRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*schema.Job, error) {
	for _, job := range m.Jobs {
		if job.Id == id {
			return job, nil
		}
	}
	return nil, errors.New("job not found")
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
		}
		assert.Equal(err.Code, 404)
		assert.Equal(err.Message, "Job does not exist!")
	})

	mt.Run("Throws Error When Given Invalid Job ID", func(mt *mtest.T) {
		// Assertions
		_, err := GetJobById("INCORRECT FORMAT", mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
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
		}
		assert.Equal(err.Code, 404)
		assert.Equal(err.Message, "Invalid JobId")
	})
}

func TestCreateJob(t *testing.T) {
	assert := assert.New(t)

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
		_, err := CreateJob(schema.Job{}, mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
		}
		assert.Equal(err.Code, 500)
		assert.Equal(err.Message, "Unable to create job")
	})
}

func TestPatchJob(t *testing.T) {
	assert := assert.New(t)

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
		bson.Unmarshal(mockJobMap, &mockJobM)
		// Assertions
		_, err := PatchJob("INVALID JOB ID", mockJobM, mt.Client)
		if err == nil {
			assert.Fail("Expected error to be thrown when retrieving non-existing ID")
		}
		assert.Equal(err.Code, 404)
		assert.Equal(err.Message, "Invalid JobID")
	})

	mt.Run("Successfully Updates and Returns Job", func(mt *mtest.T) {
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
		mockJobMap, _ := bson.Marshal(mockJob)
		var mockJobM primitive.M
		bson.Unmarshal(mockJobMap, &mockJobM)
		// Convert to bson.D
		jobBSON, _ := bson.Marshal(mockJob)
		var jobBsonData bson.D
		bson.Unmarshal(jobBSON, &jobBsonData)

		// mock update response
		mt.AddMockResponses(bson.D{
			{Key: "ok", Value: 1},
			{Key: "value", Value: jobBsonData},
		})
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
		mt.AddMockResponses(res, end)

		// Assertions
		job, err := PatchJob(mockJob.Id.Hex(), mockJobM, mt.Client)
		fmt.Println("job: ", job)
		fmt.Println("mockJob: ", mockJob)
		assert.Nil(err)
		assert.Equal(job.Id, mockJob.Id)
	})
}

func TestUpdateJob(t *testing.T) {

}

func TestGetJobsByDesignerOrProducerIdDb(t *testing.T) {

}
