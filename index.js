const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


//midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z9tlu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();

        const newsCollection = client.db('daily_news').collection('news');

        app.get('/news', async(req, res)=>{
            const news = await newsCollection.find().toArray();
            res.send(news.reverse());
        });

        app.post('/', async(req, res) =>{
            const newNews = req.body;
            const result = await newsCollection.insertOne(newNews);
            res.send(result);
        });

        //api for finding specific genre news
        app.get('/news/:genre', async(req, res) =>{
            const genre = req.params.genre;
            const query = ({genre : genre})
            const filter = await newsCollection.find(query).toArray();
            res.send(filter);
        });
    }
    finally{}
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello From Daily News')
})

app.listen(port, () => {
  console.log(`Daily news listening on port ${port}`)
})