import CountrySvc from '../api/country';
import { Country } from "../types";
import CountryRouter from '../router/country.router';

export default class CountryController {
  private _countries: Array<Country> = [];
  
  constructor(){
    this._initCountries();
    
    let _router = CountryRouter.getRouter();
    
    
    _router.get('/', this.getCountry);
  }
  
  private async _initCountries(){
    this._countries = await CountrySvc();
    console.log(this._countries);
  }
  
  
  public getCountry(): Array<Country> {
    
    return this._countries;
  }
}