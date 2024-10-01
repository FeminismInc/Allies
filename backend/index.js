// Code  for mongoose config in backend

// Code  for mongoose config in backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// all models
const UserModel = require('./models/Users')
const PostModel = require('./models/Posts');
const ConversationModel = require('./models/Conversations');
const MessageModel = require('./models/Messages');
const LikeModel = require('./models/Likes');
const MediaModel = require('./models/Media');
const FollowingModel = require('./models/Following');
const FollowersModel = require('./models/Followers');
const DislikeModel = require('./models/Dislikes');
const CommentModel = require('./models/Comments');
const BlockedModel = require('./models/Blocked');

const { Db } = require('mongodb');
const MongoDBClient = require('mongodb').MongoClient;
const serverAPI = require('mongodb').ServerApiVersion;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://kenhun2020:lhOAvQxVo7yJskRE@cluster0.ebktn.mongodb.net/Allies?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
//deleted uri
// NTS: move uri login credentials to config.env file 

app.use(express.json());


// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("Connected to MongoDB!!!!!"))
//   .catch(err => console.log("Failed to connect to MongoDB", err));

app.use(cors({
  origin: 'http://localhost:3000',  // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true  // If you need to send cookies with requests
}));


mongoose.connect(uri, { //process.env.MONGO_URI
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
    const users = await UserModel.find().populate('blocked', 'username');
    console.log(users)
    //const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// the route to get data
app.get('/getPosts', async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// the route to get data
app.get('/getConvos', async (req, res) => {
  try {
    const posts = await ConversationModel.find();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/getMessages', async (req, res) => {
  try {
    const messages = await MessageModel.find();
    console.log(messages)
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/getLikes', async (req, res) => {
  try {
    const likes = await LikeModel.find();  // Fetch all the documents from the 'Likes' collection
    console.log(likes);  // Log the fetched data
    res.json(likes);  // Send the response with the likes data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/getMedia', async (req, res) => {
  try {
    // Fetch all media documents
    const media = await MediaModel.find();
    console.log(media);
    res.json(media);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});


app.get('/getFollowing', async (req, res) => {
  try {
    // Fetch all media documents
    const following = await FollowingModel.find();
    console.log(following);
    res.json(following);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/getFollowers', async (req, res) => {
  try {
    // Fetch all media documents
    const followers = await FollowersModel.find();
    console.log(followers);
    res.json(followers);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/getDislikes', async (req, res) => {
  try {
    const dislikes = await DislikeModel.find();  // Fetch all the documents from the 'Likes' collection
    console.log(dislikes);  // Log the fetched data
    res.json(dislikes);  // Send the response with the likes data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/getComments', async (req, res) => {
  try {
    const comments = await CommentModel.find();
    console.log(comments);  // Logs the fetched comments to the console
    res.json(comments);  // Sends the comments data as a JSON response
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Route to get Blocked data
app.get('/getBlocked', async (req, res) => {
  try {
    const blockedAccounts = await BlockedModel.find();  // Fetch all blocked accounts
    console.log(blockedAccounts);  // Log the data to the console
    res.json(blockedAccounts);  // Send the blocked accounts data in the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching blocked accounts data' });
  }
});

// submit a new user? (WIP)
app.post('/form', async (req, res)=>{

  const{birthdate, username, email, password, handle, pronouns, blocked, following, followers}=req.body
  // var blockedtest = BlockedModel.find({username: username})
  // const blockedId = blockedtest._id

try {
  const newUser = new UserModel({
    birthdate,
    username,
    email,
    password,  // Remember to hash the password in production
    handle,
    pronouns,
    bio: "",
    public_boolean: true,
    joined: new Date(), // Current date for joined field
    posts: [],
    tagged_media: [],
    conversations: [],
    // WIP portion temp data
    blocked: new ObjectId('66eb9121fe2b2e83e706b1d6'), //blocked._id
    followers: (followers._id),
    following: (following._id)
    // profile_picture:
  });

  //need to add a try to catch repeat profiles
 await newUser.save();
 res.status(200).json({ message: "User created successfully" });
}catch (err) {
  console.error("Error creating user:", err);
  res.status(500).json({ message: "Error creating user" });
}
});

app.post('/newBlocked', async (req, res)=>{
  const{username}=req.body

try {
  const newBlocked = new BlockedModel({
    //_id: new ObjectId(),
    username,
    blocked_accounts: []
    // might add a username
  });

 await newBlocked.save();
 res.status(200).json({ message: "blocked created successfully" });
}catch (err) {
  console.error("Error creating blocked:", err);
  res.status(500).json({ message: "Error creating blocked" });
}
});

app.post('/newFollowing', async (req, res)=>{
  const{username}=req.body

try {
  const newFollowing = new FollowingModel({
    //_id: new ObjectId(),
    //username,
    accounts_followed: []
    // might add a username
  });

 await newFollowing.save();
 res.status(200).json({ message: "following created successfully" });
}catch (err) {
  console.error("Error creating following:", err);
  res.status(500).json({ message: "Error creating following" });
}
});

app.post('/newFollowers', async (req, res)=>{
  const{username}=req.body

try {
  const newFollowers = new FollowersModel({
    //_id: new ObjectId(),
    //username,
    follower_accounts: []
    // might add a username
  });

 await newFollowers.save();
 res.status(200).json({ message: "followers created successfully" });
}catch (err) {
  console.error("Error creating followers:", err);
  res.status(500).json({ message: "Error creating followers" });
}
});




