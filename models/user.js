const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { emailNotValid } = require('../utils/errorMessages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      isEmail, emailNotValid,
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
