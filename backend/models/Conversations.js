
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
},{ collection: 'Conversation' });

const ConversationModel = mongoose.model('convos', ConversationSchema);

module.exports = ConversationModel;