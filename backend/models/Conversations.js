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
}, { collection: 'Conversation' });

// Check if the model already exists, and use it if it does; otherwise, define a new model
const ConversationModel = mongoose.models.convos || mongoose.model('convos', ConversationSchema);

module.exports = ConversationModel;
