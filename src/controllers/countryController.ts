import { Request, Response } from 'express';
import Countries from '../api/country';
import { Country } from "../types";

const redisClient = require('../storage/redis');

class CountryController {
  constructor() {
    this.initializeCountries();
  }

  public async initializeCountries() {
    try {
      const countries = await Countries();

      await redisClient.set(
        'countries',
        JSON.stringify(countries)
      );

    } catch (err) {
      console.log('Error occurred during country initialization: ', err);
    }
  }

 /**
 * @api {GET} /api/countries Get Countries
 * @apiDescription Get Countries
 * @apiExample {js} Example usage:
 *     /api/countries
 *     /api/countries?sort=population&order=DESC
 *
 * @apiQueryParam {String} sort Field to sort
 * @apiQueryParam {String=['ASC','DESC']} order Sort order
 *
 */
  public async getAllCountries(req: Request, res: Response) {
    try {
      const orderOptions = ['ASC', 'DESC'];
      let order: string = req.query.order ? String(req.query.order) : 'ASC';

      order = order.toUpperCase();
      if (!orderOptions.includes(order)) return res.status(400).json({ message: `order must be ${orderOptions.join(' or ')}`, success: false});

      let countries = JSON.parse(await redisClient.get('countries'));

      // Sort countries by population if sort is defined as 'population'
      if (req.query.sort === 'population') {
        countries = countries.sort((a: Country, b: Country) => {
          const sortOrder = order === 'ASC' ? 1 : -1;
          return a.population < b.population ? -sortOrder : sortOrder;
        });
      }

      return res
        .status(200)
        .json({
          data: countries,
          success: true
        })
    } catch (err) {
      return res
        .status(500)
        .json({
          message: err.message,
          success: false
        })
    }
  }

  /**
 * @api {GET} /api/countries/:code Get Country
 * @apiDescription This api will fetch specific Country based on the given code
 * @apiExample {js} Example usage:
 *     /api/countries/usa
 *
 * @apiParam {String} code
 *
 */
  public async getCountry(req: Request, res: Response) {
    try {
      const { code } = req.params;

      const countries = JSON.parse(await redisClient.get('countries'));

      const existingCountry = (countries.filter((country: Country) => country.code === code))[0];

      if (existingCountry) {
        return res
        .status(200)
        .json({
          data: existingCountry,
          success: true
        })
      } else {
        return res
          .status(404)
          .json({
            message: `Country doesn't exist!`,
            success: false,
          })
      }
    } catch (err) {
      return res
        .status(500)
        .json({
          message: err.message,
          success: false
        })
    }
  }

 /**
 * @api {PUT} /api/countries/:code Update Country
 * @apiDescription This api will update Country based on the given code and new data
 * @apiExample {js} Example usage:
 *     /api/countries/aus
 *
 * @apiParam {String} code
 *
 * @apiBody {String} code
 * @apiBody {String} name
 * @apiBody {Number} population
 *
 */
  public async updateCountry(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const payload = req.body;

      const countries = JSON.parse(await redisClient.get('countries'));

      const existingCountry = (countries.filter((country: Country) => country.code === code))[0];

      if (existingCountry) {
        const updatedCountries = countries.map((country: Country) => {
          if (country.code === code) country = { ...country, ...payload };
          return country;
        });

        await redisClient.set(
          'countries',
          JSON.stringify(updatedCountries)
        );

        return res
        .status(200)
        .json({
          message: `Country ${existingCountry.name} has been successfully updated.`,
          success: true
        })
      } else {
        res
          .status(404)
          .json({
            message: `Country doesn't exist!`,
            success: false,
          })
      }
    } catch (err) {
      return res
        .status(500)
        .json({
          message: err.message,
          success: false
        })
    }
  }

 /**
 * @api {DELETE} /api/countries/:code Delete Country
 * @apiDescription This api will delete Country based on the given code
 * @apiExample {js} Example usage:
 *     /api/countries/usa
 *
 * @apiParam {String} code
 *
 */
  public async deleteCountry(req: Request, res: Response) {
    try {
      const { code } = req.params;

      const countries = JSON.parse(await redisClient.get('countries'));

      const existingCountry = (countries.filter((country: Country) => country.code === code))[0];

      if (existingCountry) {
        const newCountries = countries.filter((country: Country) => country.code !== code );

        await redisClient.set(
          'countries',
          JSON.stringify(newCountries)
        );

        return res
        .status(200)
        .json({
          message: `Country ${existingCountry.name} has been successfully deleted.`,
          success: true
        })
      } else {
        return res
          .status(404)
          .json({
            message: `Country doesn't exist!`,
            success: false,
          })
      }
    } catch (err) {
      return res
        .status(500)
        .json({
          message: err.message,
          success: false
        })
    }
   }
}

export const countryController = new CountryController();
