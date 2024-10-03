const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    url: String,
    tagged_accounts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'  // Assuming 'users' collection for tagged accounts
    }]
  }, { collection: 'Media' });
  
const MediaModel = mongoose.model('media', mediaSchema);

module.exports = MediaModel;