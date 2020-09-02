import express from 'express';
import { countryController } from '../controllers/countryController';
const { getAllCountries, getCountry, updateCountry, deleteCountry } = countryController;

// the purpose of this middleware is to ensure that the request is coming from authenticated user
import verifyAuth from '../middlewares/verifyAuth';

const countryRouter = express.Router();

countryRouter.get('/', verifyAuth, getAllCountries);
countryRouter.get('/:code', verifyAuth, getCountry);
countryRouter.put('/:code', verifyAuth, updateCountry);
countryRouter.delete('/:code', verifyAuth, deleteCountry)

export default countryRouter;