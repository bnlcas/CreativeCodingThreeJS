const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  id: String,
  name: String,
  country: String,
  score: Number,
  flavor: String
  // flavor could be an obj with multiple attributes
})

const User = mongoose.model('users', UserSchema)

module.exports = { User }