import express from 'express';

const app = express();

// middlewares
app.use(express.json());

// temp routes
// authenticate
app.post('/authenticate/login', (req, res, next) => res.status(200).json({ message: 'login' }))
app.post('/authenticate/register', (req, res, next) => res.status(200).json({ message: 'register' }))
app.get('/authenticate/me', (req, res, next) => res.status(200).json({ message: 'me' }));

// countries
app.get('/countries', (req, res, next) => res.status(200).json({ message: 'getAllCountries' }))
app.get('/countries/:code', (req, res, next) => res.status(200).json({ message: `getCountryByCode:${req.params.code}` }))
app.patch('/countries/:code', (req, res, next) => res.status(200).json({ message: `updateCountryByCode:${req.params.code}` }))
app.delete('/countries/:code', (req, res, next) => res.status(200).json({ message: `deleteCountryByCode:${req.params.code}` }));

export default app;
