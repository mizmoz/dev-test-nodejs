import { Request, Response } from "express";
import Countries from "../api/country";

// TODO: add random population

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
      let id = 1;
      let cs = await (await Countries()).map(e => {
        return ({id: id++, ...e, population: Math.floor(Math.random() * 1001)});
      });
      this.countries = cs;
    } catch(e) {
      console.log('init error: ', e);
    }
  }

  public getCountries(req: Request, res: Response) {
    res.status(200).send({
      countries: this.countries
    });
  }

  public getCountriesAscPop(req: Request, res: Response) {
    let cs = this.countries;
    cs.sort(function(a:any, b:any) {
      return parseInt(a.population) - parseInt(b.population);
    });
    res.status(200).send({
      countries: cs
    });
  }

  public getCountriesDescPop(req: Request, res: Response) {
    let cs = this.countries;
    cs.sort(function(a:any, b:any) {
      return parseInt(b.population) - parseInt(a.population);
    });
    res.status(200).send({
      countries: cs
    });
  }

  public getCountryById(req: Request, res: Response) {
    let id = req.params.id;
    let country = this.countries.find(function(x:any) { return x.id==id });
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

  public updateCountryPop(req: Request, res: Response) {
    let id = req.params.id;
    let pop = parseInt(req.body.population);
    let country = this.countries.find(function(x:any) { return x.id==id });
    if (country) {
      country.population = pop;
      res.status(200).send({
        message: 'Country population updated!'
      });
    } else {
      res.status(404).send({
        message: 'Country code not found!'
      });
    }
  }

  public updateCountry(req: Request, res: Response) {
    let id = req.params.id;
    let name = req.body.name;
    let code = req.body.code;
    let pop = parseInt(req.body.population);
    let country = this.countries.find(function(x:any) { return x.id==id });
    if (country) {
      country.name = name;
      country.code = code;
      country.population = pop;
      res.status(200).send({
        message: 'Country updated!'
      });
    } else {
      res.status(404).send({
        message: 'Country not found!'
      });
    }
  }

  public deleteCountryById(req: Request, res: Response) {
    let id = req.params.id;
    let cs = this.countries;
    let item = cs.splice(cs.findIndex(function(e:any) {return e.id === id}), 1)
    if (item.length > 0) {
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