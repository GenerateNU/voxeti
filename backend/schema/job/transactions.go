package job

import (
	"context"
	"time"

	"voxeti/backend/schema"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Find a specified job by its ID
func getJobByIdDb(jobId string, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	objectId, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Invalid JobId"}
	}
	filter := bson.M{"_id": objectId}

	// Retrieve the specified job from the collection
	var job schema.Job

	// If the job is not found, throw an error
	if err := jobCollection.FindOne(context.Background(), filter).Decode(&job); err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}

	// Return the job
	return job, nil
}

// Find a specified job by either a producer or designer ID
func getJobsByDesignerOrProducerIdDb(designerId primitive.ObjectID, producerId primitive.ObjectID, status string, limit int64, skip int64, dbClient *mongo.Client) ([]schema.Job, *schema.ErrorResponse) {
	// load jobs collection
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")

	filter := primitive.D{}
	if !designerId.IsZero() {
		filter = append(filter, bson.E{Key: "designerId", Value: designerId})
	}
	if !producerId.IsZero() {
		filter = append(filter, bson.E{Key: "producerId", Value: producerId})
	}
	if status != "" {
		filter = append(filter, bson.E{Key: "status", Value: status})
	}

	var jobs []schema.Job

	// pagination options
	paginationOptions := options.Find()
	paginationOptions.SetLimit(limit)
	paginationOptions.SetSkip(skip)

	// If jobs are not found, throw an error
	cursor, err := jobCollection.Find(context.Background(), filter, paginationOptions)
	if err != nil {
		return []schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}
	defer cursor.Close(context.Background())

	// Iterate over the cursor and append each job to the slice
	for cursor.Next(context.Background()) {
		var job schema.Job
		if err := cursor.Decode(&job); err != nil {
			return []schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Error decoding job!"}
		}
		jobs = append(jobs, job)
	}

	// If there was an error iterating over the cursor, return an error
	if err := cursor.Err(); err != nil {
		return []schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Error iterating over jobs!"}
	}
	// If no jobs exist (ex: there are 2 pages but user tries to go to "page 3")
	if jobs == nil {
		return []schema.Job{}, &schema.ErrorResponse{Code: 400, Message: "Page does not exist"}
	}

	// Return the jobs
	return jobs, nil
}

// Delete a job
func deleteJobDb(jobId string, dbClient *mongo.Client) *schema.ErrorResponse {
	jobIdObject, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return &schema.ErrorResponse{Code: 404, Message: "Invalid JobId"}
	}
	// load collection
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	// delete job and check that the job was deleted
	deleteResult, err := jobCollection.DeleteOne(context.Background(), bson.M{"_id": jobIdObject})
	if err != nil {
		return &schema.ErrorResponse{Code: 400, Message: "Error deleting job"}
	}
	if deleteResult.DeletedCount == 0 {
		return &schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}

	return nil
}

// Creates a job
func createJobDb(newJob schema.Job, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	// insert the job into the database
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	result, err := jobCollection.InsertOne(context.Background(), newJob)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Unable to create job"}
	}
	// add an ID field to the new job
	newJob.Id = result.InsertedID.(primitive.ObjectID)
	return newJob, nil
}

// Updates a job
func updateJobDb(jobId string, job schema.Job, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	jobIdObject, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Job does not exist!"}
	}
	job.Id = jobIdObject
	// create a new job with the given data
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	// replace the old job with the new job
	_, err = jobCollection.ReplaceOne(context.Background(), bson.M{"_id": jobIdObject}, job)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Job update failed"}
	}
	return job, nil
}

// Updates a specific field in a job
func patchJobDb(jobIdStr string, patchData bson.M, dbClient *mongo.Client) (schema.Job, *schema.ErrorResponse) {
	// Convert jobId string to ObjectId
	jobId, parseError := primitive.ObjectIDFromHex(jobIdStr)
	if parseError != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Invalid JobID"}
	}
	// Update Job in Database
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	_, err := jobCollection.UpdateOne(context.Background(), bson.M{"_id": jobId}, bson.M{"$set": patchData})
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 500, Message: "Unable to update job"}
	}
	updatedJob := schema.Job{}
	// Confirm job exists
	err = jobCollection.FindOne(context.Background(), bson.M{"_id": jobId}).Decode(&updatedJob)
	if err != nil {
		return schema.Job{}, &schema.ErrorResponse{Code: 404, Message: "Unable to retrieve updated job"}
	}
	return updatedJob, nil
}

func getJobsByFilterDb(filter *primitive.M, dbClient *mongo.Client) (*[]schema.Job, *schema.ErrorResponse) {
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")

	// get jobs with filter and add to jobs
	cursor, err := jobCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, &schema.ErrorResponse{Code: 500, Message: err.Error()}
	}

	var jobs []schema.Job
	if err := cursor.All(context.Background(), &jobs); err != nil {
		return nil, &schema.ErrorResponse{Code: 500, Message: "Error decoding jobs!"}
	}

	return &jobs, nil
}

func declineJobDb(jobId string, producerId *primitive.ObjectID, dbClient *mongo.Client) *schema.ErrorResponse {
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	jobObjectId, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return &schema.ErrorResponse{Code: 400, Message: "Invalid JobId"}
	}

	filter := bson.M{
		"_id": jobObjectId,
		"declinedProducers": bson.M{
			"$nin": []primitive.ObjectID{*producerId},
		},
	}

	update := bson.M{
		"$push": bson.M{"declinedProducers": producerId},
	}

	options := options.FindOneAndUpdate().SetReturnDocument(options.After)
	var updatedJob schema.Job
	err = jobCollection.FindOneAndUpdate(context.Background(), filter, update, options).Decode(&updatedJob)

	if err == mongo.ErrNoDocuments {
		return &schema.ErrorResponse{Code: 400, Message: "Producer has already declined this job"}
	} else if err != nil {
		return &schema.ErrorResponse{Code: 500, Message: "Unable to decline job"}
	}

	return nil
}

func acceptJobDb(jobId string, producerId *primitive.ObjectID, dbClient *mongo.Client) *schema.ErrorResponse {
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	jobObjectId, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return &schema.ErrorResponse{Code: 400, Message: "Invalid JobId"}
	}

	filter := bson.M{
		"_id": jobObjectId,
	}

	// set producerId to producerId
	update := bson.M{
		"$set": bson.M{"producerId": producerId},
	}

	_, err = jobCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return &schema.ErrorResponse{Code: 500, Message: "Unable to accept job"}
	}

	return nil
}

func addPotentialProducerDb(jobId *primitive.ObjectID, producerId *primitive.ObjectID, dbClient *mongo.Client) *schema.ErrorResponse {
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")

	update := bson.M{
		"$push": bson.M{"potentialProducers": producerId},
		"$set":  bson.M{"lastUpdated": time.Now()},
	}
	_, err := jobCollection.UpdateOne(context.Background(), bson.M{"_id": jobId}, update)
	if err != nil {
		return &schema.ErrorResponse{Code: 500, Message: "Unable to add potential producer"}
	}

	return nil
}

func getPotentialProducerJobsDb(producerId *primitive.ObjectID, dbClient *mongo.Client) (*[]schema.Job, *schema.ErrorResponse) {
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")

	// get jobs where producerId is in potentialProducers array
	cursor, err := jobCollection.Find(context.Background(), bson.M{"potentialProducers": bson.M{"$in": []primitive.ObjectID{*producerId}}})
	if err != nil {
		return nil, &schema.ErrorResponse{Code: 500, Message: err.Error()}
	}

	var jobs []schema.Job
	if err := cursor.All(context.Background(), &jobs); err != nil {
		return nil, &schema.ErrorResponse{Code: 500, Message: "Error decoding jobs!"}
	}

	return &jobs, nil
}

func transferPotentialToDeclinedDb(TRANSFER_NUM int, MAX_INACTIVE time.Duration, dbClient *mongo.Client) *schema.ErrorResponse {

	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")

	thresholdTime := time.Now().Add(-MAX_INACTIVE)

	filter := bson.M{
		"$expr": bson.M{
			"$and": bson.A{
				bson.M{
					"$gt": bson.A{
						bson.M{"$size": bson.M{"$ifNull": bson.A{"$potentialProducers", []interface{}{}}}},
						0,
					},
				},
				bson.M{
					"$lt": bson.A{
						"$lastUpdated",
						thresholdTime,
					},
				},
			},
		},
	}

	cursor, err := jobCollection.Find(context.Background(), filter)
	if err != nil {
		return &schema.ErrorResponse{Code: 500, Message: err.Error()}
	}

	var jobs []schema.Job
	if err := cursor.All(context.Background(), &jobs); err != nil {
		return &schema.ErrorResponse{Code: 500, Message: "Error decoding jobs!"}
	}

	// iterate over jobs and transfer potential producers to declined producers
	// transfer first TRANSFER_NUM potential producers to declined producers
	for _, job := range jobs {
		potentialProducers := job.PotentialProducers
		declinedProducers := job.DeclinedProducers
		if len(potentialProducers) < TRANSFER_NUM {
			TRANSFER_NUM = len(potentialProducers)
		}
		transferredProducers := potentialProducers[:TRANSFER_NUM]
		declinedProducers = append(declinedProducers, transferredProducers...)
		potentialProducers = potentialProducers[TRANSFER_NUM:]
		_, err = jobCollection.UpdateOne(context.Background(), bson.M{"_id": job.Id}, bson.M{"$set": bson.M{"potentialProducers": potentialProducers, "declinedProducers": declinedProducers}})
		if err != nil {
			return &schema.ErrorResponse{Code: 500, Message: "Unable to transfer potential producers to declined producers"}
		}
	}

	return nil
}

func deleteMaxDeclinedJobsDb(MAX_DECLINED_PRODUCERS int, dbClient *mongo.Client) *schema.ErrorResponse {

	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")

	// delete jobs where declinedProducers array is greater than MAX_DECLINED_PRODUCERS
	_, err := jobCollection.DeleteMany(context.Background(), bson.M{"$expr": bson.M{"$gt": bson.A{bson.M{"$size": bson.M{"$ifNull": bson.A{"$declinedProducers", []interface{}{}}}}, MAX_DECLINED_PRODUCERS}}})

	if err != nil {
		return &schema.ErrorResponse{Code: 500, Message: "Unable to delete jobs exceeding max declined producers"}
	}

	return nil
}

func removePotentialProducerDb(jobId string, producerId *primitive.ObjectID, dbClient *mongo.Client) *schema.ErrorResponse {
	jobCollection := dbClient.Database(schema.DatabaseName).Collection("jobs")
	jobObjectId, err := primitive.ObjectIDFromHex(jobId)
	if err != nil {
		return &schema.ErrorResponse{Code: 400, Message: "Invalid JobId"}
	}

	// remove producer from potential producers
	_, err = jobCollection.UpdateOne(context.Background(), bson.M{"_id": jobObjectId}, bson.M{"$pull": bson.M{"potentialProducers": producerId}})
	if err != nil {
		return &schema.ErrorResponse{Code: 500, Message: "Unable to remove potential producer"}
	}

	return nil
}
