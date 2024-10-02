
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  text: String,
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users"
  },
  comments: [{
    type: mongoose.SchemaTypes.ObjectId
  }],
  datetime: Date,
  dislikes: {
    type: mongoose.SchemaTypes.ObjectId
  },
  media: [{
    type: mongoose.SchemaTypes.ObjectId
  }],
  likes: {
    type: mongoose.SchemaTypes.ObjectId
  },
  hashtags: [{
    type: String
  }],
  repost: {
    type: mongoose.SchemaTypes.ObjectId
  }
},{ collection: 'Posts' });

const PostModel = mongoose.model('posts', PostSchema);

module.exports = PostModel;

