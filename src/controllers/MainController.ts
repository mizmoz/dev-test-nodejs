import { Request, Response } from "express";
import Countries from "../api/country";

// TODO: add random population

export class MainController {
  public countries: any;

  constructor() {
    console.log('constructor');
    this.init();
  }

  public async init() {
    try {
      console.log('init');
      let cs = await Countries();
      this.countries = cs;
    } catch(e) {
      console.log('init error: ', e);
    }
  }

  public root(req: Request, res: Response) {
    res.status(200).send({
      message: "GET request successful!!"
    });
  }

  public getCountries(req: Request, res: Response) {
    //let c : typeof Countries = [];
    res.status(200).send({
      countries: this.countries
    });
  }

  public async getCountriesSorted(req: Request, res: Response) {
    //let c : typeof Countries = [];
    let countries = await Countries();
    res.status(200).send({
      countries: countries
    });
  }

}

export const mainController = new MainController();