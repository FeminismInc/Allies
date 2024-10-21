
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, 
  birthday: Date,
  email: String,
  password: String,
  username: String,
  joined: { type: Date, default: new Date() },
  handle: String,
  bio: String,
  pronouns: String,
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Change to ObjectId array
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Followers' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Following' }],
  posts: [{ 
    type: mongoose.Schema.Types.ObjectId,
 }],
  tagged_media: [{ 
    type: mongoose.Schema.Types.ObjectId, 
 }],
  conversations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'convos',
 }],
  public_boolean: Boolean,
  profile_picture: { 
    type: mongoose.Schema.Types.ObjectId, 
     } 


},{ collection: 'UserDetail' });

const UserModel = mongoose.model('users', UserSchema, 'UserDetail');

module.exports = UserModel;

