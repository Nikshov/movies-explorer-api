const router = require('express').Router();
const NotFoundError = require('../utils/notFoundError');
const auth = require('../middlewares/auth');
const authRouter = require('./auth');
const userRouter = require('./user');
const movieRouter = require('./movie');
const { notFoundPage } = require('../utils/errorMessages');

router.use('/', authRouter);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError(notFoundPage));
});

module.exports = router;
