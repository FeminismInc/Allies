const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
  sender: String,
  destination: String,
  id: String,
  datetime: Date,
  message_content: String
}, { collection: 'Messages' });

// Check if the model already exists in mongoose.models to avoid overwriting
const MessageModel = mongoose.models.messages || mongoose.model('messages', messagesSchema);

module.exports = MessageModel;
