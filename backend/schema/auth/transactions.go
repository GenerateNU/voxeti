package auth

import (
  "context"
  "encoding/json"
  "io"
  "net/http"
  "slices"
  "strings"
  "voxeti/backend/schema"

  "go.mongodb.org/mongo-driver/bson"
  "go.mongodb.org/mongo-driver/mongo"
)

func GetUserByEmail(email string, dbClient *mongo.Client) (*schema.User, *schema.ErrorResponse) {
  errResponse := &schema.ErrorResponse{}

  // Access the users collection and initialize a filter:
  usersCollection := dbClient.Database(schema.DatabaseName).Collection("users")
  filter := bson.D{{Key: "email", Value: email}}

  // Retrieve the user:
  user := &schema.User{}
  if err := usersCollection.FindOne(context.Background(), filter).Decode(user); err != nil {
    errResponse.Code = 400
    errResponse.Message = "User does not exist!"
    return nil, errResponse
  }

  // Return the user:
  return user, nil
}

func GetGoogleSSOUser(accessToken schema.GoogleAccessToken) (*schema.GoogleResponse, *schema.ErrorResponse) {
  errResponse := &schema.ErrorResponse{}

  // Initialize request to Google API
  req, err := http.NewRequest("GET", "https://oauth2.googleapis.com/tokeninfo", nil)
  if err != nil {
    errResponse.Code = 500
    errResponse.Message = "Failed initializing Google OAuth API request!"
    return nil, errResponse
  }
  // Add bearer auth
  req.Header.Add("Authorization", "Bearer "+accessToken.AccessToken)

  // Create the http client
  client := http.Client{}

  // Initialize the request:
  res, err := client.Do(req)
  if err != nil {
    errResponse.Code = 500
    errResponse.Message = "Failed contacting Google OAuth API!"
    return nil, errResponse
  }
  defer res.Body.Close()

  body, err := io.ReadAll(res.Body)
  if err != nil {
    errResponse.Code = 500
    errResponse.Message = "Failed reading the response body from Google OAuth API!"
    return nil, errResponse
  }

  // Convert data to JSON:
  var googleRes schema.GoogleResponse
  err = json.Unmarshal(body, &googleRes)
  if err != nil {
    errResponse.Code = 500
    errResponse.Message = "Unable to unmarshal Google API response!"
    return nil, errResponse
  }

  if googleRes.Email == "" {
    errResponse.Code = 400
    errResponse.Message = "Invalid access token!"
    return nil, errResponse
  }

  scopes := strings.Split(googleRes.Scope, " ")
  if len(scopes) < 3 || !slices.Contains(scopes, "https://www.googleapis.com/auth/userinfo.profile") || !slices.Contains(scopes, "https://www.googleapis.com/auth/userinfo.email") {
    errResponse.Code = 400
    errResponse.Message = "Invalid Google OAuth Scopes!"
    return nil, errResponse
  }

  return &googleRes, nil
}
