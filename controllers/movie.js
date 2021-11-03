const Movie = require('../models/movie');
const NotFoundError = require('../utils/notFoundError');
const ForbiddenError = require('../utils/forbiddenError');
const {
  notFoundCard, wrongOwner,
} = require('../utils/errorMessages');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
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
    .then((movie) => res.send(movie))
    .catch(next);
};

const removeMovie = (req, res, next) => {
  const { _id } = req.params;
  const owner = req.user._id;
  Movie.findById({ _id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(notFoundCard);
      }
      if (owner !== String(movie.owner)) {
        throw new ForbiddenError(wrongOwner);
      }
      return movie.remove().then(() => res.send({
        message: 'Карточка была удалена',
      }));
    })
    .catch(next);
};

module.exports = { getMovies, addMovie, removeMovie };
