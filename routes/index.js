const router = require('express').Router();

const auth = require('../middlewares/auth');
const authRouter = require('./auth');
const userRouter = require('./user');
const movieRouter = require('./movie');

router.use('/', authRouter);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = router;
