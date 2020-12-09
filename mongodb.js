// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log(error);
    }
    console.log("Connected to mongodb at" + connectionURL);
    const db = client.db(dbName);
    db.collection("tasks")
      .deleteOne({ description: "complete the module" })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }
);
