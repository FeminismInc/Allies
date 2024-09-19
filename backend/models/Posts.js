
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  textBox: String,
  creatorAccountId: String,
  dateTime: Date,
  media: String,
  likes: [{
    type: mongoose.SchemaTypes.ObjectId
  }],

},{ collection: 'Posts' });

const PostModel = mongoose.model('posts', PostSchema);

module.exports = PostModel;