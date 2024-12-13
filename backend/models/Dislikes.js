const mongoose = require('mongoose');

const DislikesSchema = new mongoose.Schema({
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comments' // Optional reference to the related collection
  },
  accounts_that_disliked: [{ type: String }], // Array of usernames that disliked
}, { collection: 'Dislikes' });

// Use existing model if available, otherwise create a new one
const DislikeModel = mongoose.models.dislikes || mongoose.model('dislikes', DislikesSchema);

module.exports = DislikeModel;
