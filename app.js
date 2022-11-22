const express = require('express'); // web framework
const app = express();
require('dotenv').config(); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const { User } = require("./models/User")

const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPw}@cluster0.m4fpkbp.mongodb.net/?retryWrites=true&w=majority`;

// check mongoose connxn
// const mongoose = require('mongoose')
// mongoose.connect(uri, { useNewUrlParser: true })
// const db = mongoose.connection
// db.once('open', _ => {
//   console.log('Database connected:', uri)
// })
// db.on('error', err => {
//   console.error('connection error:', err)
// })

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("IceCream").collection("devices");
  // perform actions on the collection object
  console.log({ collection })

  client.close();
});

app.use(express.static('src')); 

app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/dist/index.html`);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);
});