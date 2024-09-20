// Code  for mongoose config in backend


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users')


const app = express();
app.use(cors());
app.use(express.json()); 


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() =>{
  app.listen(5050, '0.0.0.0', () =>{
    console.log("Server is running")
  })
  console.log("Connected to MongoDB")
})
  .catch(err => console.log("Failed to connect to MongoDB", err));




// Define a route to get data
app.get('/getUsers', async (req, res) => {
  UserModel.find()
  .then(users => res.json(users))
  .catch(err => res.json(err))
});



