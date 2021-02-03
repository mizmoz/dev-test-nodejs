/**
 * Module Dependencies
 */
import bodyParser from 'body-parser';
import express from 'express';

import authentication from 'middleware/authentication';
import CountryController from 'rest/controller/CountryController';

export default express
  .Router()
  .use(authentication)
  .get('/countries', CountryController.list)
  .get('/countries/:code', CountryController.get)
  .put(
    '/countries/:code/populations',
    bodyParser.json(),
    CountryController.updatePopulation,
  )
  .put('/countries/:code', bodyParser.json(), CountryController.update)
  .delete('/countries/:code', CountryController.delete);
