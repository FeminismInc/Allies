
const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    author: String, // username of user posting comment
    datetime: Date,
    likes: [{
      type: mongoose.Schema.Types.ObjectId,  // Reference to likes
    }],
    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,  // Reference to dislikes
    }],
    replies: [{ //rename this to comments, 
      type: mongoose.Schema.Types.ObjectId,  // Array of ObjectIds referencing replies
    }],
    text: String,  // The comment content
    parentIsPost: [{
      type: Boolean, default: true
    }], // Boolean to check wether or not the comment is under another comment or a post
    postId: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'Posts' //could reference Comments
    }
  }, { collection: 'Comments' });
  
const CommentModel = mongoose.model('comments', commentsSchema);

module.exports = CommentModel;
