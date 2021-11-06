require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const configRateLimit = require('./utils/configRateLimit');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { devMongo } = require('./utils/devConfig');
const routes = require('./routes/index');

const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://mexplorer.nomoredomains.work',
  'https://mexplorer.nomoredomains.work',
];

const { DATABASE = devMongo } = process.env;
const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit(configRateLimit);
mongoose.connect(DATABASE);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(requestLogger);

app.use((req, res, next) => {
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.send();
  }

  return next();
});

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT);
