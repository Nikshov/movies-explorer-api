const Movie = require('../models/movie');
const NotFoundError = require('../utils/notFoundError');
const ForbiddenError = require('../utils/forbiddenError');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

const removeMovie = (req, res, next) => {
  const { _id } = req.params;
  const owner = req.user._id;
  Movie.findById({ _id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка с таким ID не найдена.');
      }
      if (owner !== String(movie.owner)) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      movie.remove();
      res.status(200).send({
        message: 'Карточка была удалена',
      });
    })
    .catch(next);
};

module.exports = { getMovies, addMovie, removeMovie };
