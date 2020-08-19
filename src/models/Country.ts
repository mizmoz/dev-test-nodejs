import { BaseCountryModel, Country } from "../types";

export class CountryModel implements BaseCountryModel{

  private countries : Country[];
  constructor(countries : Country[]) {
    this.countries = countries;
  }

  listAll(mockResolve : boolean) : Promise<Country[]> {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => mockResolve ? resolve(this.countries) : reject([]),
        100
      )
    });
  }

  updateOne(code : string, data : { name : string} ) {
    const country = this.getOne(code);

    if (country === undefined) {
      return undefined;
    }

    country.name = data.name;

    return country;
  }

  deleteOne(code : string) {
    const foundCountry = this.getOne(code);

    if (foundCountry) {
      const countries = this.countries.filter(country => code !== country.code);
      this.countries = countries;
      return true;
    }

    return false;
  }

  getOne(code : string) {
    return this.countries.find(country => country.code === code);
  }

  updatePopulation(code : string, data : {population : number}) {
    const country = this.getOne(code);

    if (country === undefined) {
      return undefined;
    }

    country.population = data.population;

    return country;
  }

  sortCountries(order : 'ASC'| 'DES') {

    const countries = this.countries.sort((a, b) => {

      const countryA : number = a.population || 0;
      const countryB : number = b.population || 0;

      if (order === 'ASC') {
        return countryA - countryB;
      } else {
        return countryB - countryA;
      }
    });


    return countries;
  }
}