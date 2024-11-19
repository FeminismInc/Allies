
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  text: String,
  author: String,
  comments: [{
    type: mongoose.SchemaTypes.ObjectId, ref: 'Comments'
  }],
  datetime: Date,
  dislikes: [{
    type: mongoose.SchemaTypes.ObjectId
  }],
  media: [{
    type: mongoose.SchemaTypes.ObjectId
  }],
  likes: [{
    type: mongoose.SchemaTypes.ObjectId
  }],
  hashtags: [{
    type: String
  }],
  repost: {
    type: mongoose.SchemaTypes.ObjectId, //links back to original post?
    ref: 'posts'
  }
},{ collection: 'Posts' });

const PostModel = mongoose.model('posts', PostSchema);

module.exports = PostModel;

