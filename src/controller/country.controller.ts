import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";
import CountrySvc from "../api/country";
import { Country } from "../types";
import RedisClient from "../api/redis";

export default class CountryController {
  private _countries: Array<Country> = [];
  private storage: RedisClient;

  constructor() {
    this.storage = new RedisClient();
    this._initCountries();
  }

  private async _initCountries() {
    try {
      let countries = await this.storage.get("countries");
      if (countries == null) {
        countries = await CountrySvc();
        if (countries === undefined) {
          this._initCountries();
          return;
        }
        countries.map(async (country: Country) => {
          this._countries.push({
            ...country,
            population: this.randomPopulation(),
          });
        });
        this._refreshStorage();
      } else this._countries = JSON.parse(countries);
    } catch (e) {
      console.log(e);
    }
  }

  private randomPopulation() {
    return Math.floor(Math.random() * 100000);
  }

  public async getAllCountry(req: Request, res: Response) {
    try {
      if (!this._countries.length) await this._initCountries();
      if (req.query.code !== undefined || req.query.name) {
        this.getCountry(req, res);
        return;
      }
      let sort = req.query.sort || "ASC";
      let _countries = this._countries.sort((a: Country, b: Country) => {
        let a_p = a.population as number;
        let b_p = b.population as number;
        return sort === "DESC" ? (a_p > b_p ? -1 : 1) : a_p > b_p ? 1 : -1;
      });
      res.status(HttpStatus.OK).json({
        data: _countries,
      });
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  private _getCountry({ code, name }: any): Promise<Country> {
    return new Promise((resolve, reject) => {
      let country;
      if (code === "" && name === "") {
        reject({ message: "No valid parameter" });
        return;
      } else if (code && name == "") {
        country = this._countries.find(c => c.code === code);
      } else if (name && code == "") {
        country = this._countries.find(c => c.name.toLowerCase() === name);
      } else {
        country = this._countries.find(c => c.code === code);
      }
      if (country === undefined) {
        reject({ message: "No available country" });
        return;
      }
      resolve(country);
    });
  }

  public async getCountry(req: Request, res: Response) {
    try {
      let code = (req.params.code || req.query.code || "") as string;
      let name = (req.params.name || req.query.name || "") as string;
      if (!this._countries.length) await this._initCountries();
      if (code.length > 3) {
        name = code;
        code = "";
      }
      const country = await this._getCountry({ code, name });
      if (country !== undefined) res.status(HttpStatus.OK).json(country);
      else
        res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json({ message: "Invalid Parameter" });
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  /**
   * addCountry
   */
  public async addCountry(req: Request, res: Response) {
    try {
      const newCountry = req.body as Country;
      this._countries.push({
        ...newCountry,
        population: this.randomPopulation(),
      });
      this._refreshStorage();
      res.status(HttpStatus.OK).json({
        message: "success",
      });
    } catch (e) {
      res.status(HttpStatus.EXPECTATION_FAILED).json({
        message: e.message,
      });
    }
  }

  /**
   * updateCountry
   */
  public async updateCountry(req: Request, res: Response) {
    try {
      const qCode = req.params.code;
      const { name, population } = req.body as Country;
      let code = qCode || req.body;
      const _coutry = await this._getCountry({ code });
      if (_coutry === undefined) {
        throw new Error("Country code not valid.");
      }
      _coutry.code = code;
      _coutry.name = name;
      _coutry.population = population;
      this._refreshStorage();
      res.status(HttpStatus.OK).json({
        message: "success",
      });
    } catch (e) {
      res.status(HttpStatus.EXPECTATION_FAILED).json({
        message: e.message,
      });
    }
  }

  /**
   * deleteCountry
   */
  public async deleteCountry(req: Request, res: Response) {
    try {
      const code = req.params.code;
      const _coutryIndex = this._countries.findIndex(c => c.code === code);
      if (_coutryIndex < 0) {
        throw new Error("Country code not valid.");
      }
      this._countries.splice(_coutryIndex, 1);
      this._refreshStorage();
      res.status(HttpStatus.OK).json({
        message: "success",
      });
    } catch (e) {
      res.status(HttpStatus.EXPECTATION_FAILED).json({
        message: e.message,
      });
    }
  }

  private _refreshStorage() {
    this.storage.set("countries", JSON.stringify(this._countries));
  }
}
