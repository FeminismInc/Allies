
const mongoose = require('mongoose');

const LikesSchema = new mongoose.Schema({
  postId : mongoose.SchemaTypes.ObjectId,
  accounts_that_liked: [{type: String }],
}, { collection: 'Likes' });  // Specify the collection name 'Likes'
  
  // Create the model from the schema
  const LikeModel = mongoose.model('likes', LikesSchema);

  module.exports = LikeModel;
