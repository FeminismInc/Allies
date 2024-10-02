const mongoose = require('mongoose');

// Define the Blocked schema
const blockedSchema = new mongoose.Schema({
    username: String,
    blocked_accounts: [{
      type: mongoose.Schema.Types.ObjectId,  // Assuming blocked_accounts refers to ObjectId
    }],
  }, { collection: 'Blocked' });
  
const BlockedModel = mongoose.model('blocked', blockedSchema, 'Blocked');

module.exports = BlockedModel;