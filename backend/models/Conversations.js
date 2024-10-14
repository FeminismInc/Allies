
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  users: [{
    type: String,
    ref: 'users',
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'messages',
  }],
},{ collection: 'Conversation' });

const ConversationModel = mongoose.model('convos', ConversationSchema);

module.exports = ConversationModel;