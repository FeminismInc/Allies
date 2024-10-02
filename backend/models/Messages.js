const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
    },
    datetime: Date,
    message_content: String
  }, { collection: 'Messages' });

  const MessageModel = mongoose.model('messages', messagesSchema);
  
  module.exports = MessageModel;