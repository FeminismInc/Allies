
const mongoose = require('mongoose');

const DislikesSchema = new mongoose.Schema({
    postId : mongoose.SchemaTypes.ObjectId,
    accounts_that_disliked: [{type: String }],
  }, { collection: 'Dislikes' });  // Specify the collection name 'Likes'
  
  // Create the model from the schema
const DislikeModel = mongoose.model('dislikes', DislikesSchema);

module.exports = DislikeModel;
