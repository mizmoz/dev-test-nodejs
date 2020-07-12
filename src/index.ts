import express from 'express';
import { NOT_FOUND } from 'http-status-codes';
import countries from './configs/country';
import Redis from './lib/redis';
import * as middleware from './lib/middlewares'
import * as country from './api/country';

const app = express();
const redis = Redis.getInstance();

// Seeder
(async () => {
  redis.set('countries', countries);
})();

// Configs
app.set('port', process.env.PORT);

// Middlewares
app.use(express.json());

// Routes with custom middleware
app.get('/countries', middleware.auth, country.getAllCountries);
app.patch('/countries/:name', middleware.auth, country.updateCountry);
app.delete('/countries/:name', middleware.auth, country.deleteCountry);

// Handle 404
app.use(function(req, res, next) {
  return res.status(NOT_FOUND).send({
    message: 'Not found',
  });
});

app.listen(app.get('port'), () => {
  console.log(`Server listening on port %d`, app.get('port'));
});

export default app;
