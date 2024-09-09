// Code  for mongoose config in backend

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users')
//const MongoDBClient = require('mongodb').MongoClient;    will probably need for later
const serverAPI = require('mongodb').ServerApiVersion;


const app = express();
const uri = "mongodb+srv://4calderonabigail:4calderonabigail@cluster0.ebktn.mongodb.net/Allies?retryWrites=true&w=majority&appName=Cluster0";
// NTS: move uri login credentials to config.env file 

app.use(express.json());


/* mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB!!!!!"))
  .catch(err => console.log("Failed to connect to MongoDB", err)); */

  app.use(cors());
  
  
  mongoose.connect(uri, {
    serverApi: serverAPI.v1 //  MongoDB Server API
  }).then(() => {
    console.log("Connected to MongoDB!!");
    app.listen(5050, () => { // Move the server listening inside the connection callback
      console.log("Server is running on port 5050")
    });
  }).catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });
  
  // the route to get data
  app.get('/getUsers', async (req, res) => {
    try {
      const users = await UserModel.find();  
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });


