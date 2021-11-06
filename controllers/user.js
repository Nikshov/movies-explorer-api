const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ConflictError = require('../utils/conflictError');
const NotFoundError = require('../utils/notFoundError');
const UnauthorizedError = require('../utils/unauthorizedError');
const { devKey } = require('../utils/devConfig');
const {
  wrongPassOrMail, mailAlreadyUsed, notFoundUser,
} = require('../utils/errorMessages');

const getUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      const { email, name } = user;
      res.send({ email, name });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError(notFoundUser);
      return res.send({ message: 'Информация о пользователе обновлена' });
    })
    .catch(next);
};

const createNewUser = (req, res, next) => {
  const { email, password, name } = req.body;
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(mailAlreadyUsed);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => res.send({ message: 'Пользователь успешно зарегистрирован' }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError(wrongPassOrMail);
      bcrypt.compare(password, user.password)
        .then((m) => {
          if (!m) throw new UnauthorizedError(wrongPassOrMail);
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devKey,
            { expiresIn: '7d' });
          const { _doc } = { ...user };
          delete _doc.password;
          res
            .cookie('token', token, {
              maxAge: 604800000, httpOnly: true, sameSite: 'Strict', secure: true,
            })
            .send(_doc);
        })
        .catch(next);
    })
    .catch(next);
};

const logout = (req, res) => {
  res.cookie('token', '', {
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
