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
        const resaleCategory = client.db("resaleShop").collection("category");
        const productsCollection = client.db("resaleShop").collection("products");

        app.get('/category', async (req, res) => {
            const query = {};
            const options = await resaleCategory.find(query).toArray();
            res.send(options);
        })

        app.get('/category/:name', async (req, res) => {
            const name = req.params.name;
            const query = { name: name };
            const category = await resaleCategory.findOne(query);
            res.send(category);
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })

    } catch (error) {
        console.log(error.stack);
    }
        
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('Resale shop is open');
})

app.listen(port, () => console.log(`Server is running on port: ${port}`))