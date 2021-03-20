import { RequestHandler } from 'express';


import countriesDataSet from '../configs/country';
import * as Redis from '../redis';
import { Country } from '../types';
import { Errors } from '../utils';

/**
 * API to get the countries, sometimes this fails.
 *
 */
const getCountriesPromise = async (): Promise<Country[]> => {
  try {
    const countries: Country[] = [];
    const keys = await Redis.getKeysByPrefix('country*');
    if (keys.length) {
      await Promise.all(
        keys.map(async (key) => {
          const countryString = await Redis.get(key);
          if (countryString) {
            countries.push(JSON.parse(countryString));
          }
        })
      );
    }

    return countries;
  } catch (error) {
    throw new Errors.BadRequestError(error.message);
  }
};

export const seed: RequestHandler = async (req, res, next) => {
  try {
    countriesDataSet.forEach(async (country: { name: string, code: string }) => {
      await Redis.set(`country:${country.code}`, JSON.stringify({
        ...country,
        population: Math.floor(Math.random() * 1000)
      }));
    });

    return res.status(201).json({ message: 'Seeding success.' });
  } catch (error) {
    return next(error);
  }
};

export const getCountries: RequestHandler = async (req, res, next) => {
  const { query } = req;

  try {
    let countries: Country[] = await getCountriesPromise();
    if (query?.sort) {
      const asc = (a: Country, b: Country) => (a.population > b.population) ? 1 : -1;
      const desc = (a: Country, b: Country) => (a.population > b.population) ? -1 : 1;
      const sort = query.sort === 'asc' ? asc : desc;

      countries = countries.sort(sort);
    }
    return res.status(200).json({ countries });
  } catch (error) {
    return next(error);
  }
};

export const deleteCountryByCode: RequestHandler = async (req, res, next) => {
  const { params: { code } } = req;

  try {
    const countryString = await Redis.get(`country:${code}`);
    if (!countryString) {
      throw new Errors.BadRequestError('Country does not exist.');
    }

    const country: Country = JSON.parse(countryString);
    await Redis.del(`country:${code}`);

    return res.status(200).json({ country });
  } catch (error) {
    return next(error);
  }
};

export const getCountryByCode: RequestHandler = async (req, res, next) => {
  const { params: { code } } = req;

  try {
    const countryString = await Redis.get(`country:${code}`);
    if (!countryString) {
      throw new Errors.BadRequestError('Country does not exist.');
    }

    const country: Country = JSON.parse(countryString);

    return res.status(200).json({ country });
  } catch (error) {
    return next(error);
  }
};

export const updateCountryByCode: RequestHandler = async (req, res, next) => {
  const {
      params: { code },
      body: { population }
    } = req;

  try {
    const countryString = await Redis.get(`country:${code}`);
    if (!countryString) {
      throw new Errors.BadRequestError('Country does not exist.');
    }

    let country: Country = JSON.parse(countryString);
    country = {
      name: country.name,
      code: country.code,
      population
    }

    await Redis.set(`country:${code}`, JSON.stringify(country));

    return res.status(200).json({ country });
  } catch (error) {
    return next(error);
  }
};
