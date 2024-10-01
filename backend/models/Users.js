
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  birthday: Date,
  email: String,
  password: String,
  username: String,
  joined: { type: Date, default: new Date() },
  handle: String,
  bio: String,
  blocked: { 
    type: mongoose.Schema.Types.ObjectId,
 },
  pronouns: String,
  followers: { 
    type: mongoose.Schema.Types.ObjectId,
 },
  following: { 
    type: mongoose.Schema.Types.ObjectId,
},
  posts: [{ 
    type: mongoose.Schema.Types.ObjectId,
 }],
  tagged_media: [{ 
    type: mongoose.Schema.Types.ObjectId, 
 }],
  conversations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
 }],
  public_boolean: Boolean,
  profile_picture: { 
    type: mongoose.Schema.Types.ObjectId, 
     } 


},{ collection: 'UserDetail' });

const UserModel = mongoose.model('users', UserSchema, 'UserDetail');

module.exports = UserModel;

