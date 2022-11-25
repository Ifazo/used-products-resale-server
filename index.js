const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection:
const uri = `mongodb+srv://ifazo:uSWJqnk5v5kMYDez@cluster0.qyb0v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// CRAD oparetion
async function run() {
    try {
        const resaleCategory = await client.db("resaleShop").collection("category");

        app.get('/category', async (req, res) => {
            const query = {};
            const options = await resaleCategory.find(query).toArray();
            res.send(options);
        })
        // await client.connect();
        // const database = client.db('test');
        // const collection = database.collection('test');

        // // create
        // const doc = { name: 'ifaz', age: 25 };
        // const result = await collection.insertOne(doc);
        // console.log(`A document was inserted with the _id: ${result.insertedId}`);

        // // read
        // const cursor = collection.find();
        // await cursor.forEach(console.dir);

        // // update
        // const query = { name: 'ifaz' };
        // const updateDoc = {
        //     $set: {
        //         age: 26,category
        //     },
        // };
        // const result = await collection.updateOne   
    } catch (error) {
        console.log(error.stack);
    }
        
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('Resale shop is open');
})

app.listen(port, () => console.log(`Server is running on port: ${port}`))