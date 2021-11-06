const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, addMovie, removeMovie } = require('../controllers/movie');
const urlValidator4Joi = require('../utils/urlValidator4Joi');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator4Joi),
    trailer: Joi.string().required().custom(urlValidator4Joi),
    thumbnail: Joi.string().required().custom(urlValidator4Joi),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), removeMovie);

module.exports = router;
