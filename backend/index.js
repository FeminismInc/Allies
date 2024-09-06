// Code  for mongoose config in backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users')


const app = express();
app.use(cors());
app.use(express.json()); 

app.listen(5050, () =>{
  console.log("Server is running")
})

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Failed to connect to MongoDB", err));




// Define a route to get data
app.get('/getUsers', async (req, res) => {
  UserModel.find()
  .then(users => res.json(users))
  .catch(err => res.json(err))
});


