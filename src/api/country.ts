import express from 'express';
import { NOT_FOUND, UNPROCESSABLE_ENTITY, CONFLICT } from 'http-status-codes';
import Joi from '@hapi/joi';

import { Country } from '../types';
import * as redis from '../entities/redis';

const getCountries = () => redis.get<Country[]>('countries');
const setCountries = (newCountries: Country[]) => redis.set<Country[]>('countries', newCountries);

/**
 * API to get the countries, sometimes this fails.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
export const list = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const querySchema = Joi.object({
      sort_by: Joi.string()
        .valid('population', 'name', 'code'),
      order_by: Joi.string()
        .valid('asc', 'desc'),
    }).options({ abortEarly: false, });

    const validate = querySchema.validate(req.query);

    if (validate.error) {
      res.status(UNPROCESSABLE_ENTITY).json({
        message: 'Unable to process request.',
        errors: validate.error.message,
      });
      return;
    }

    let data: Country[] | null = await new Promise((resolve, reject) => {
      return getCountries().then((countries) => {
        setTimeout(
          () => (Math.round(Math.random()) === 0 ? resolve(countries) : reject(new Error('Failed getting countries.'))),
          100
        );
      });
    });

    if (!data) {
      res.status(NOT_FOUND).json({
        message: 'No resources found.',
      });
      return;
    }

    let { sort_by: sortBy, order_by: orderBy = 'asc', } = req.query;

    if (sortBy) {
      orderBy = (orderBy as 'asc' | 'desc')?.toLowerCase();

      const field = sortBy as 'population' | 'name' | 'code';

      data = data.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return orderBy === 'asc' ? aValue - bValue : bValue - aValue;
        }

        aValue = aValue.toString();
        bValue = aValue.toString();

        return orderBy === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
    }

    res.json({
      message: 'Here are the countries.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * API to update a country.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
export const update = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const bodySchema = Joi.object({
      name: Joi.string()
        .min(4)
        .uppercase()
        .strict(),
      code: Joi.string()
        .length(3)
        .lowercase()
        .strict(),
      population: Joi.number()
        .min(0)
        .strict(),
    }).options({ abortEarly: false, });

    const validate = bodySchema.validate(req.body);

    if (validate.error) {
      res.status(UNPROCESSABLE_ENTITY).json({
        message: 'Unable to process request.',
        errors: validate.error.message,
      });
      return;
    }

    const { name, } = req.params;
    const countries = await getCountries() || [];
    const countryToUpdate = countries.find(country => country.name === name.toUpperCase());

    if (countryToUpdate) {
      const isNewNameOrCodeExist = countries.some(country => countryToUpdate !== country && (country.name === req.body.name || country.code === req.body.code));

      if (isNewNameOrCodeExist) {
        res.status(CONFLICT).send({
          message: 'New name and/or code already exist.',
        });
        return;
      }

      const newNameValue = req.body.name ?? countryToUpdate.name;
      const newCodeValue = req.body.code ?? countryToUpdate.code;
      const newPopulationValue = req.body.population ?? countryToUpdate.population;

      if (countryToUpdate.name === newNameValue && countryToUpdate.code === newCodeValue && countryToUpdate.population === newPopulationValue) {
        res.status(UNPROCESSABLE_ENTITY).send({
          message: 'No new country value to be updated.',
        });
        return;
      }

      countryToUpdate.name = newNameValue;
      countryToUpdate.code = newCodeValue;
      countryToUpdate.population = newPopulationValue;

      await setCountries(countries);

      res.send({
        message: 'Country is updated.',
      });
      return;
    }

    res.status(NOT_FOUND).send({
      message: 'Country not found.',
    });
  } catch (error) {
    next(Error);
  }
};

/**
 * API to delete a country.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
export const destroy = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const { name, } = req.params;
    const countries = await getCountries() || [];
    const countryIndex = countries.findIndex(country => country.name === name.toUpperCase());

    if (countryIndex !== -1) {
      countries.splice(countryIndex, 1);

      await setCountries(countries);

      res.send({
        message: 'Country is deleted.',
      });
      return;
    }

    res.status(NOT_FOUND).send({
      message: 'Country not found.',
    });
  } catch (error) {
    next(error);
  }
};
