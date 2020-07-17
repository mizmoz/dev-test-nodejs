import { Request, Response } from "express";
import Countries from "../api/country";
const redisClient = require('../api/redis-client');

export class MainController {
  public countries: any;

  constructor() {
    this.init();
  }

  /**
   * init will include additional properties into the country: id and random population
   */

  public async init() {
    try {
      console.log('Load the countries.');
      await (await Countries()).map(async function(e) {
        //return ();
        const value = {...e, population: Math.floor(Math.random() * 1001)};
        await redisClient.setAsync(e.code, JSON.stringify(value));
      });
      //this.countries = cs;
    } catch(e) {
      console.log('init error: ', e);
    }
  }

  public async getCountries(req: Request, res: Response) {
    let keys = await redisClient.keysAsync('*');
    let countries = await redisClient.mgetAsync(keys);
    res.status(200).send({
      countries: countries
    });
  }

  public async getCountriesAscPop(req: Request, res: Response) {
    let keys = await redisClient.keysAsync('*');
    let countries = await redisClient.mgetAsync(keys);
    await countries.sort(function(a:any, b:any) {
      return parseInt(a.population) - parseInt(b.population);
    });
    res.status(200).send({
      countries: countries
    });
  }

  public async getCountriesDescPop(req: Request, res: Response) {
    let keys = await redisClient.keysAsync('*');
    let countries = await redisClient.mgetAsync(keys);
    await countries.sort(function(a:any, b:any) {
      return parseInt(b.population) - parseInt(a.population);
    });
    res.status(200).send({
      countries: countries
    });
  }

  public async getCountryById(req: Request, res: Response) {
    let key = req.params.id;
    let country = await redisClient.getAsync(key);
    if (country) {
      res.status(200).send({
        country: country
      });
    } else {
      res.status(404).send({
        message: 'Country code not found!'
      });
    }
  }

  public async updateCountryPop(req: Request, res: Response) {
    let key = req.params.id;
    let pop = parseInt(req.body.population);
    let str = await redisClient.getAsync(key);
    if (str) {
      let country = JSON.parse(str);
      country.population = pop;

      // update the database then send response
      await redisClient.setAsync(key, JSON.stringify(country));
      res.status(200).send({
        message: 'Country population updated!'
      });
    } else {
      res.status(404).send({
        message: 'Country code not found!'
      });
    }
  }

  public async updateCountry(req: Request, res: Response) {
    let key = req.params.id;
    let name = req.body.name;
    let code = req.body.code;
    let pop = parseInt(req.body.population);
    let str = await redisClient.getAsync(key);
    if (str) {
      let country = JSON.parse(str);
      country.name = name;
      country.code = code;
      country.population = pop;

      // update the database then send response
      await redisClient.setAsync(key, JSON.stringify(country));
      res.status(200).send({
        message: 'Country updated!'
      });
    } else {
      res.status(404).send({
        message: 'Country not found!'
      });
    }
  }

  public async deleteCountryById(req: Request, res: Response) {
    let key = req.params.id;
    let result = await redisClient.delAsync(key);
    if (result > 0) {
      res.status(200).send({
        message: 'Country deleted!'
      });
    } else {
      res.status(404).send({
        message: 'Country not found!'
      });
    }
  }
}

export const mainController = new MainController();