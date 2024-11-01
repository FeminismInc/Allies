
const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    author: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to the author
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to likes
    },
    dislikes: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to dislikes
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,  // Array of ObjectIds referencing replies
    }],
    text: String,  // The comment content
  }, { collection: 'Comments' });
  
const CommentModel = mongoose.model('comments', commentsSchema);

module.exports = CommentModel;
