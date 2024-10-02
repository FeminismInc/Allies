
const mongoose = require('mongoose');

const DislikesSchema = new mongoose.Schema({
    accounts_that_disliked: [{
      type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds representing accounts
    }],
  }, { collection: 'Dislikes' });  // Specify the collection name 'Likes'
  
  // Create the model from the schema
const DislikeModel = mongoose.model('dislikes', DislikesSchema);

module.exports = DislikeModel;
