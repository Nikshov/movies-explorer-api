const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { createNewUser, login, logout } = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createNewUser);

router.post('/signout', auth, logout);

module.exports = router;
