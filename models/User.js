const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  id: String,
  name: String,
  country: String,
  flavor: String
  // flavor could be an obj with more attributes
})

const User = mongoose.model('users', UserSchema)

module.exports = { User }