const mongoose = require('mongoose');
const { isURL } = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [
      isURL, 'URL адрес не валиден',
    ],
  },
  trailer: {
    type: String,
    required: true,
    validate: [
      isURL, 'URL адрес не валиден',
    ],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [
      isURL, 'URL адрес не валиден',
    ],
  },
  owner: {
    required: true,
  },
  movieId: {
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
