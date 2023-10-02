import MongoClient from "mongodb";

/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = "mongodb://administrator:Welcome1234@localhost:27017/";
const databasename = "data"; // Database name

MongoClient.connect(uri)
  .then((client) => {
    const connect = client.db(databasename);

    // New Collection
    createUserCollection(connect);

    console.log("collection created");
  })
  .catch((err) => {
    // Handling the error
    console.log(err.Message);
  });

async function createUserCollection(connect) {
  connect.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "User  Object Validation",
        required: [
          "username",
          "firstName",
          "lastName",
          "email",
          "birthday",
          "phoneNumber",
          "userType",
        ],
        properties: {
          username: {
            bsonType: "string",
            minimum: 4,
            maximum: 20,
            description:
              "'username' must be a string, length range of [4,20] and is required",
          },
          firstName: {
            bsonType: "string",
            minimum: 1,
            maximum: 50,
            description:
              "'firstName' must be a string, length range of [1,50] and is required",
          },
          lastName: {
            bsonType: "string",
            minimum: 1,
            maximum: 50,
            description:
              "'lastName' must be a string, length range of [1,50] and is required",
          },
          email: {
            bsonType: "string",
            description:
              "'email' must be a string, in the format of xxx@xxx.xx, and is required",
          },
          birthday: {
            bsonType: "string",
            description:
              "'birthday' must be a string, in the format of YYYY-MM-DD, and is required",
          },
          address: {
            bsonType: "object",
            properties: {
              coordinates: {
                bsonType: "array",
                minimum: 2,
                maximum: 2,
                description:
                  "'coordinates' must be a coordinates pair [longitude, latitude]",
              },
              primaryAddress: {
                bsonType: "string",
                description: "'primaryAddress' must be a string",
              },
              secondaryAddress: {
                bsonType: "string",
                description: "'secondaryAddress' must be a string",
              },
              city: {
                bsonType: "string",
                description: "'city' must be a string",
              },
              state: {
                bsonType: "string",
                description: "'state' must be a string",
              },
              zipcode: {
                bsonType: "string",
                description: "'zipcode' must be a string",
              },
              country: {
                bsonType: "string",
                description: "'country' must be a string",
              },
            },
          },
          phoneNumber: {
            bsonType: "object",
            properties: {
              countryCode: {
                bsonType: "string",
                minimum: 1,
                maximum: 5,
                description:
                  "'countryCode' must be a string, length range of [1,5], and is required",
              },
              number: {
                bsonType: "string",
                minimum: 10,
                maximum: 10,
                description:
                  "'number' must be a string, length of 10, and is required",
              },
            },
          },
          userType: {
            bsonType: "string",
            enum: ["Designer", "Producer"],
            description:
              "'userType' must be a string, must be one of 'Producer' or 'Designer', and is required",
          },
        },
      },
    },
  });
}
