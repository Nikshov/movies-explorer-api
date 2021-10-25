require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ConflictError = require('../utils/conflictError');
const NotFoundError = require('../utils/notFoundError');
const UnauthorizedError = require('../utils/unauthorizedError');

const getUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      const { email, name } = user;
      res.status(200).send({ email, name });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким ID не найден.');
      return res.status(200).send('Информация о пользователе обновлена');
    })
    .catch(next);
};

const createNewUser = (req, res, next) => {
  const { email, password, name } = req.body;
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с такой почтой уже существует');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => res.status(200).send({ message: 'Пользователь успешно зарегистрирован' }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError('Неправильные почта или пароль');
      bcrypt.compare(password, user.password)
        .then((m) => {
          if (!m) throw new UnauthorizedError('Неправильные почта или пароль');
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret',
            { expiresIn: '7d' });
          const { _doc } = { ...user };
          delete _doc.password;
          res
            .status(200)
            .cookie('token', token, {
              /* !! */ maxAge: 604800000, httpOnly: true, sameSite: 'Strict', /* secure: true, */
            })
            .send(_doc);
        })
        .catch(next);
    })
    .catch(next);
};

const logout = (req, res) => {
  res.status(200).cookie('token', '', {
    maxAge: -1, httpOnly: true, sameSite: 'Strict', secure: true,
  }).send({});
};

module.exports = {
  createNewUser,
  getUser,
  updateUser,
  login,
  logout,
};
