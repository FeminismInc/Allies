
const mongoose = require('mongoose');

const LikesSchema = new mongoose.Schema({
    accounts_that_liked: [{
      type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds representing accounts
      ref: 'users',
    }],
  }, { collection: 'Likes' });  // Specify the collection name 'Likes'
  
  // Create the model from the schema
  const LikeModel = mongoose.model('likes', LikesSchema);

  module.exports = LikeModel;
