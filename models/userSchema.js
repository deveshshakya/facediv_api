const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {type: String, unique: true, required: true, dropDups: true},
  password: String,
  entries: {type: Number, default: 0},
  joined: {type: Date, default: new Date()}
});

module.exports = userSchema;
