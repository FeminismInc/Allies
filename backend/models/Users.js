
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  birthday: Date,
  handle: String,

},{ collection: 'UserDetail' });

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;