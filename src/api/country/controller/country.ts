import { NextFunction, Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import Countries from '../services/country'

const redisClient = require('../../redis')

export class CountryController {
  public countries: any

  constructor() {
    this.initCountries()
  }

  public async initCountries() {
    try {
      const countriesWithPopulation: any = []
      await (await Countries()).map(async country => {
        const value = {
          ...country,
          population: Math.floor(Math.random() * 1001),
        }
        countriesWithPopulation.push(value)
      })
      await redisClient.setAsync(
        'countries',
        JSON.stringify(countriesWithPopulation),
      )
    } catch (e) {
      console.log('init error: ', e)
    }
  }

  public async getAllCountry(req: Request, res: Response, next: NextFunction) {
    console.log('getAllCountry')
    try {
      const countriesArr = await redisClient.getAsync('countries')
      const countries = JSON.parse(countriesArr);
      res.status(HttpStatus.OK).json({
        result: countries,
        success: true,
      })
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message, success: false })
    }
  }

  public createCountry(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message, success: false })
    }
  }

  public async getCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.params.id
      const countryData = await redisClient.getAsync(key)
      const country = JSON.parse(countryData);
      if (country) {
        res.status(HttpStatus.OK).send({
          result: country,
          success: true,
        })
      } else {
        res.status(HttpStatus.NOT_FOUND).send({
          message: 'Country code not found!',
          success: false,
        })
      }
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message, success: false })
    }
  }

  public async updateCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.params.id
      const name = req.body.name
      const code = req.body.code
      const pop = parseInt(req.body.population, 0)
      const str = await redisClient.getAsync(key)
      if (str) {
        const country = JSON.parse(str)
        country.name = name
        country.code = code
        country.population = pop

        // update the database then send response
        await redisClient.setAsync(key, JSON.stringify(country))
        res.status(HttpStatus.OK).send({
          message: 'Country updated!',
          success: true,
        })
      } else {
        res.status(HttpStatus.NOT_FOUND).send({
          message: 'Country not found!',
          success: false,
        })
      }
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message, success: false })
    }
  }

  public async deleteCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.params.id
      const result = await redisClient.delAsync(key)
      if (result > 0) {
        res.status(HttpStatus.OK).send({
          message: 'Country deleted!',
          success: true,
        })
      } else {
        res.status(HttpStatus.NOT_FOUND).send({
          message: 'Country not found!',
          success: false,
        })
      }
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message, success: false })
    }
  }
}

export const countryController = new CountryController()
