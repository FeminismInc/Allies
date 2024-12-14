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
  profile_picture: String,
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Followers' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Following' }],
  followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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
}, { collection: 'UserDetail' });

// Check if the model already exists in mongoose.models to avoid overwriting
const UserModel = mongoose.models.users || mongoose.model('users', UserSchema);

module.exports = UserModel;
