
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  joined: Date,
  birthday: Date,
  handle: String,
  bio: String,
  blocked : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }]

},{ collection: 'UserDetail' });

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;