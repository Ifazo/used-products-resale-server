const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection:
const uri = `mongodb+srv://ifazo:uSWJqnk5v5kMYDez@cluster0.qyb0v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const resaleCategory = client.db("resaleShop").collection("category");
    const productsCollection = client.db("resaleShop").collection("products");
    const bookingsCollection = client.db("resaleShop").collection("bookings");
    const usersCollection = client.db("resaleShop").collection("users");
    const advertiseCollection = client.db("resaleShop").collection("advertise");

    app.get("/category", async (req, res) => {
      const query = {};
      const category = await resaleCategory.find(query).toArray();
      res.send(category);
    });

    app.get("/category/:name", async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const category = await resaleCategory.findOne(query);
      res.send(category);
    });

    app.get("/categoryproducts", async (req, res) => {
      let query = {};
      if(req.query.category){
        query = {category: req.query.category}
      }
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    
    app.get("/myproducts", async (req, res) => {
      let query = {};
      if(req.query.email){
        query = {email: req.query.email}
      }
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/products", async (req, res) => {
      const query = {};
      const products = await productsCollection.find(query).toArray();
      res.send(products);
    });

    app.get("/bookings", async (req, res) => {
      const query = {};
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });

    app.get('/users', async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.json(result);
    });

    app.post('/advertise', async (req, res) => {
      const product = req.body;
      const result = await advertiseCollection.insertOne(product);
      res.json(result);
    });

    
    app.put('/user/admin/:id', async (req, res) => {
      const query = req.params.email;
      const user = await usersCollection.findOne(query);
      if(user?.role !== 'admin'){
        return res.status(401).send({message: 'Unauthorized access'});
      }
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Resale shop is open");
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));
