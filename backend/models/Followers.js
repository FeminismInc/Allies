
const mongoose = require('mongoose');

const FollowersSchema = new mongoose.Schema({
    username: String,
    follower_accounts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    }]
  }, { collection: 'Followers' });
  
const FollowersModel = mongoose.model('followers', FollowersSchema, 'Followers');

module.exports = FollowersModel;
