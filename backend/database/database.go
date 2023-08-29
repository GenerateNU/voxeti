package database

import (
  "context"
  "time"
  "go.mongodb.org/mongo-driver/mongo"
  "go.mongodb.org/mongo-driver/mongo/options"
  "go.mongodb.org/mongo-driver/mongo/readpref"
)

var Client *mongo.Client

func Connect(uri string) error {
  ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
  Client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
  if err != nil {
    return err
  }
  // ping the server to ensure successful connection
  return Client.Ping(ctx, readpref.Primary())
}

func Disconnect() error {
  ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
  return Client.Disconnect(ctx)
}
