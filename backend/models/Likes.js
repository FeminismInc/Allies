const mongoose = require('mongoose');

const LikesSchema = new mongoose.Schema({
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comments' // Optionally add a reference to the related collection
  },
  accounts_that_liked: [{ type: String }], // Array of usernames that liked
}, { collection: 'Likes' });

// Use existing model if available, otherwise create a new one
const LikeModel = mongoose.models.likes || mongoose.model('likes', LikesSchema);

module.exports = LikeModel;
