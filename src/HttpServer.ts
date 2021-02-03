/**
 * Module Dependencies
 */
import compression from 'compression';
import express from 'express';
import http from 'http';

import config from '@config';
import errorHandler from 'middleware/errorHandler';
import logErrorHandler from 'middleware/logErrorHandler';
import countries from 'routes/countries';

const app = express();

app.disable('x-powered-by');

app.use(compression({ threshold: 0 }));

app.use(express.Router().use(countries));

app.use(logErrorHandler());
app.use(errorHandler());

// catch 404 and forward to error handler
app.use((req, res) => res.status(404).send('404 Not Found'));

const server = http.createServer(app);

server.listen(config.get('HTTP_PORT'), () =>
  console.log(
    `HTTP Server is listening on http://0.0.0.0:${config.get('HTTP_PORT')}`,
  ),
);
