import * as Redis from '../redis';
import countries from "../configs/country";
import { Country } from "../types/country";

export const migrate = async () => {
  countries.forEach(async (country: { name: string, code: string }) => {
    await Redis.set(`country:${country.code}`, JSON.stringify({
      ...country,
      population: Math.floor(Math.random() * 100000000)
    }));
  });
}

export const list = async (sort: any): Promise<Country[]> => {
  let countries: Country[] = [];
  const keys = await Redis.getKeysByPrefix('country*');
  if (keys.length) {
    await Promise.all(
      keys.map(async (key) => {
        const countryString = await Redis.get(key);
        if (countryString) {
          countries.push(JSON.parse(countryString));
        }
      })
    );
  }

  if (sort) {
    const asc = (x: Country, y: Country) => (x.population > y.population) ? 1 : -1;
    const desc = (x: Country, y: Country) => (x.population > y.population) ? -1 : 1;

    countries = countries.sort((sort === 'asc' ? asc : desc));
  }

  return countries;
};

export const update = async (code: string, population: number) =>{
  const response = await Redis.get(`country:${code}`);

  if(!response){
    throw new Error('The country does not exist in the DB. Please check the parameters');
  }

  let country: Country = JSON.parse(response);
  country = {
    name: country.name,
    code: country.code,
    population
  }

  await Redis.set(`country:${code}`, JSON.stringify(country));
}

export const remove = async (code: string) =>{
  const response = await Redis.get(`country:${code}`);

  if(!response){
    throw new Error('The country does not exist in the DB. Please check the parameters');
  }

  const country: Country = JSON.parse(response);

  await Redis.remove(`country:${code}`);
}

export const removeAll = async () =>{
  const response = await Redis.flushdb();
}
