const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/unauthorizedError');
const { devKey } = require('../utils/devConfig');
const { authError } = require('../utils/errorMessages');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthorizedError(authError);
  }
  let payload;
  const { NODE_ENV, JWT_SECRET } = process.env;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : devKey,
    );
  } catch (err) {
    throw new UnauthorizedError(authError);
  }

  req.user = payload;

  return next();
};
