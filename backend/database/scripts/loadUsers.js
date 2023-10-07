MongoClient = require("mongodb").MongoClient;

/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = "mongodb://administrator:Welcome1234@localhost:27017/";
const databasename = "data"; // Database name

const client = new MongoClient(uri);

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(databasename);
  const collection = db.collection("users");

  await loadGoodUsers(collection);
  await loadBadUsers(collection);

  client.close();
  // the following code examples can be pasted here...

  return "done.";
}
main();

async function loadGoodUsers(collection) {
  const result = await collection.insertMany([
    {
      username: "johndoe123",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      birthday: "1990-01-01",
      phoneNumber: {
        countryCode: "+1",
        number: "0123456789",
      },
      userType: "Designer",
    },
    {
      username: "sophiaran",
      firstName: "Sophia",
      lastName: "Ran",
      email: "sophia.ran@xyz.com",
      birthday: "1996-02-28",
      phoneNumber: {
        countryCode: "+1",
        number: "3123229289",
      },
      userType: "Producer",
    },
    {
      username: "fayvandamme",
      firstName: "Fay",
      lastName: "Van Damme",
      email: "Fay.VanDamme@testing.com",
      birthday: "2000-12-31",
      phoneNumber: {
        countryCode: "+1",
        number: "3123229289",
      },
      userType: "Designer",
    },
  ]);

  console.log(`${result.insertedCount} documents were inserted`);
}

async function loadBadUsers(collection) {
  const result = await collection.insertMany([
    {
      username: "jd",
      firstName: "Short",
      lastName: "Username",
      email: "janedoe@example.com",
      birthday: "1991-01-01",
      phoneNumber: {
        countryCode: "+1",
        number: "0123456789",
      },
      userType: "Designer",
    },
    {
      username: "badbirthday",
      firstName: "Bad",
      lastName: "Birthday",
      email: "badbirthday@xyz.com",
      birthday: "02-28-1996",
      phoneNumber: {
        countryCode: "+1",
        number: "3123229289",
      },
      userType: "Producer",
    },
    {
      username: "badusertype",
      firstName: "bad",
      lastName: "Usertype",
      email: "badusertype@testing.com",
      birthday: "2000-12-31",
      phoneNumber: {
        countryCode: "+1",
        number: "3123229289",
      },
      userType: "Random",
    },
  ]);

  console.log(`${result.insertedCount} documents were inserted`);
}
