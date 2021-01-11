import bodyParser from 'body-parser';
import countryRouter from './routes/country';
import express from 'express';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/country', countryRouter);

export default app;
