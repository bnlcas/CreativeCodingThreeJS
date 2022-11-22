const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  id: String,
  name: String,
  country: String,
  flavor: String
})

mongoose.model('users', userSchema)