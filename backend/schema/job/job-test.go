package job

import (
	"context"
	"errors"
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
	/* Test Case Ideas:
	if given an invalid ID what do we get out, if an email is not properly formatted, those validations are more relevant
	*/

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
		foundJob, _ := GetJobById(jobIdHex, mt.Client)
		assert.Equal(foundJob, expectedJob)
	})

}

func TestDeleteJob(t *testing.T) {
	// assert := assert.New(t)

	// // Use the mockDB
	// mockRepo := &MockJobRepository{Jobs: mockDB}

	// // Select a job ID from your mockDB
	// var selectedJobID primitive.ObjectID
	// for _, job := range mockDB {
	//     selectedJobID = job.Id
	//     break
	// }

	// job := DeleteJob(context.Background(), selectedJobID, mockRepo)
	// // assert.NoError(err)
	// assert.NotNil(job)
	// assert.Equal(selectedJobID, job.Id)
}

func TestCreateJob(t *testing.T) {

}

func TestUpdateJob(t *testing.T) {

}

func TestPatchJob(t *testing.T) {

}
