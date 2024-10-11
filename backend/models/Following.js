const mongoose = require('mongoose');

const FollowingSchema = new mongoose.Schema({
    username: String,
    accounts_followed: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }]
  }, { collection: 'Following' });
  
  const FollowingModel = mongoose.model('following', FollowingSchema, 'Following');

  module.exports = FollowingModel;