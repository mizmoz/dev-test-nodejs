import express from 'express';
import routes from './configs/routes';

const app = express();
const route = require("express").Router();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
