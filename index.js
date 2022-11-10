const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middileWares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yaqgjrz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("rapidTrip").collection("services");
    const feedBackCollection = client.db("rapidTrip").collection("feedbacks");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.post("/services", async (req, res) => {
      const postServices = req.body;
      const result = await serviceCollection.insertOne(postServices);
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // FeedBacks Api
    app.post("/feedbacks", async (req, res) => {
      const feedback = req.body;
      const result = await feedBackCollection.insertOne(feedback);
      res.send(result);
    });

    app.get("/feedbacks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id };
      const result = feedBackCollection.find(query);
      const service = await result.toArray();
      res.send(service);
    });

    app.get("/feedbacks", async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const cursor = feedBackCollection.find(query);
      const feedbacks = await cursor.toArray();
      res.send(feedbacks);
    });

    app.delete("/feedbacks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await feedBackCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Rapid Trip Server is Running");
});

app.listen(port, () => {
  console.log(`Rapid Trip Server running on ${port}`);
});
