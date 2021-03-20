import express, { ErrorRequestHandler } from 'express';

import {
  login,
  me,
  register
} from './api/authenticate';
import {
  deleteCountryByCode,
  getCountries,
  getCountryByCode,
  seed,
  updateCountryByCode,
} from './api/country';
import { verifyToken } from './middlewares/verifyToken';
import { Context } from './utils';

const app = express();

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (!error?.status) {
    error.status = 500;
  }

  return res.status(error.status).json({ message: error.message });
};

// middlewares
app.use(express.json());

// add context
app.use((req, res, next) => {
  Context.bind(req);
  next();
});

// authenticate
app.post('/authenticate/login', login)
app.post('/authenticate/register', register)
app.get('/authenticate/me', verifyToken, me);

// countries
app.post('/countries/seed', seed);
app.get('/countries', getCountries);
app.get('/countries/:code', getCountryByCode);
app.patch('/countries/:code', updateCountryByCode)
app.delete('/countries/:code', deleteCountryByCode);

// 404 handler
app.use((req, res, next) => res.status(404).json({ message: 'Resource not found.' }));

// error handler
app.use(errorHandler);

export default app;
