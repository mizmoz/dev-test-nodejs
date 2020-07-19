import { BadRequestError } from 'restify-errors';
import Country from '../services/country';

import {
  ICountry,
  IPopulation,
  ISort,
} from '../types';

const CountryController = (server: any, redis: any) => {
    // Country list
  server.get('/countries', async (req: any, res: any, next: any) => {
    const country = new Country(redis);

    const countries = await country.getCountries();

    res.send(countries);
    return next();
  });

  // Get country sorted by population
  server.get('/countries/population/:sort', async (req: any, res: any, next: any) => {
    const { params: { sort = '' } = {} } = req;
    if (!sort) {
      return res.send(new BadRequestError('sort is mandatory'));
    }

    const sortObj: ISort = { order: sort };
    const country = new Country(redis);

    const countries = await country.getCountriesSortedByPopulation(sortObj);

    res.send(countries);
    return next();
  });

  // Update population by country
  server.put('/countries/population/:countryCode', async (req: any, res: any, next: any) => {
    const { params: { countryCode = '' } = {}, body } = req;

    if (!countryCode) {
      return res.send(new BadRequestError('countryCode is mandatory'));
    }

    if (!body && !body.population) {
      return res.send(new BadRequestError('invalid request body'));
    }

    if (typeof body.population !== 'number') {
      return res.send(new BadRequestError('population must be a number'));
    }

    const populationToUpdate: ICountry | IPopulation = {
      code: countryCode,
      name: '',// Not needed
      population: body.population,
    };

    const country = new Country(redis);
    const updatedList = await country.updateCountry(populationToUpdate, { type: 'population' });

    res.send(updatedList);
    return next();
  });

  // Update country
  server.put('/countries/:countryCode', async (req: any, res: any, next: any) => {
    const { params: { countryCode = '' } = {}, body } = req;
    const { name } = body;

    if (!countryCode) {
      return res.send(new BadRequestError('countryCode is mandatory'));
    }

    if (!body && !name) {
      return res.send(new BadRequestError('invalid request body'));
    }

    if (typeof name !== 'string') {
      return res.send(new BadRequestError('name must be a string'));
    }

    const countryToUpdate: ICountry | IPopulation = {
      code: countryCode,
      name,
      population: undefined, // Not needed
    };

    const country = new Country(redis);
    const updatedList = await country.updateCountry(countryToUpdate);

    res.send(updatedList);
    return next();
  });

  // Delete country
  server.del('/countries/:countryCode', async (req: any, res: any, next: any) => {
    const { params: { countryCode = '' } = {} } = req;

    if (!countryCode) {
      return res.send(new BadRequestError('countryCode is mandatory'));
    }

    const countryToDelete: ICountry | IPopulation = {
      code: countryCode,
      name: '', // Not needed
      population: undefined, // Not needed
    };

    const country = new Country(redis);
    const updatedList = await country.deleteCountry(countryToDelete);

    res.send(updatedList);
    return next();
  });
}

export default CountryController;