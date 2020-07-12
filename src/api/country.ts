
import express from 'express';
import { BAD_REQUEST, NOT_FOUND, NO_CONTENT, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import Joi from '@hapi/joi';
import Redis from '../lib/redis';

import { Country } from "../types";
const redis = Redis.getInstance();

/**
 * Get all countries
 * @param req
 * @param res
 */
export const getAllCountries = async (req: express.Request, res: express.Response) => {
  try {

    /**
     * API to get the countries, sometimes this fails.
     */
    const countries: Array<Country> | null = await new Promise<Country[] | null>((resolve, reject) => {
      return redis.get<Country[]>('countries').then((countries) => {
        setTimeout(
          () => (Math.round(Math.random()) === 0 ? resolve(countries) : reject(new Error('Timeout error'))),
          100
        );
      });
    });

    return res.json({
      data: countries,
    });
  } catch (e) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
}

/**
 * Updates a country
 * @param req
 * @param res
 */
export const updateCountry = async (req: express.Request, res: express.Response) => {
  try {
    const { name:paramName } = req.params;

    const updateSchema = Joi.object({
      name: Joi.string()
        .uppercase()
        .required(),
      code: Joi.string()
        .lowercase()
        .strict(),
      population: Joi.number()
        .min(0)
        .default(0)
    }).options({
      abortEarly: false,
    });

    const { error } = updateSchema.validate(req.body);

    if (error) {
      return res.status(BAD_REQUEST).json({
        errors: error.details,
      });
    }

    const { name, code, population } = req.body;

    const countries: Array<Country> | null = await redis.get<Array<Country>>('countries');
    const existingCountry: Country | undefined = countries!.find(country => country.name === paramName.toUpperCase());

    if (existingCountry) {
      const isExistingCountry: boolean = countries!.some(country => existingCountry.name !== country.name && (country.name === name));

      if (isExistingCountry) {
        return res.status(BAD_REQUEST).send({
          errorMessage: 'Country already existing',
        });
      }

      existingCountry.name = name || existingCountry.name;
      existingCountry.code = code || existingCountry.code;
      existingCountry.population = population || null;

      await redis.set('countries', countries);
      return res.json({
        data: existingCountry,
      });
    }

    return res.status(NOT_FOUND).send({
      errorMessage: 'Country not found',
    });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
}

/**
 * Deletes a country
 * @param req
 * @param res
 */
export const deleteCountry = async (req: express.Request, res: express.Response) => {
  try {
    const { name } = req.params;
    const countries: Array<Country> | null = await redis.get<Array<Country>>('countries');
    const existingCountryIndex: number | undefined = countries!.findIndex(country => country.name === name.toUpperCase());

    if (existingCountryIndex !== -1) {
      countries!.splice(existingCountryIndex, 1);
      await redis.set('countries', countries);
      return res.status(NO_CONTENT).end();
    }

    return res.status(NOT_FOUND).send({
      errorMessage: 'Country not found',
    });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
}

