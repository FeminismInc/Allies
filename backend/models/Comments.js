const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  author: String, // username of user posting comment
  datetime: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Likes',
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Dislikes',
  }],
  comments: [{  // Previously "replies"
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comments',
  }],
  text: String,  // The comment content
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'parentType',
  },
  parentType: {
    type: String,
    enum: ['Posts', 'Comments'],
    required: true,
  },
}, { collection: 'Comments' });

const CommentModel = mongoose.models.comments || mongoose.model('comments', commentsSchema);

module.exports = CommentModel;
