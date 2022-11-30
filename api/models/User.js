const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  id: String, // unique
  name: String,
  country: String,
  flavor: String,
  // flavor could be an obj with multiple attributes
  score: Number,
})

const User = mongoose.model('users', UserSchema)

module.exports = { User }