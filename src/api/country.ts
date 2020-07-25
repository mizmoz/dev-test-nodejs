import countries from "../configs/country";
import { Country } from "../types";
import { logger } from "../utils/logger";

/**
 * API to get the countries, sometimes this fails.
 *
 */
export const list = (): Promise<Array<Country>> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.round(Math.random()) === 0
        ? resolve(countries)
        : reject({ error: `Failed to retrieve Country List` });
    }, 100);
  });

/**
 * API to update population of a country, sometimes this fails too.
 * @param country country to update population
 */

export const updatePopulation = (country: Country): Promise<boolean> =>
  new Promise((resolve, reject) => {
    setTimeout(
      () =>
        Math.round(Math.random()) === 0
          ? resolve(processUpdatePopulation(country))
          : reject({ error: `Failed to update Country Population` }),
      100,
    );
  });

/**
 * Processor for updating population of a country.
 * @param country country to update population
 * @returns boolean if update is successful
 */
const processUpdatePopulation = (country: Country): boolean => {
  const temp = countries.find(c => c.code === country.code) as Country;
  if (temp) {
    temp.population = country.population;
    return true;
  }
  return false;
};

/**
 * API to update country, sometimes this fails too.
 * @param country country to update
 */
export const updateCountry = (country: Country): Promise<boolean> =>
  new Promise((resolve, reject) => {
    setTimeout(
      () =>
        Math.round(Math.random()) === 0
          ? resolve(processUpdateCountry(country))
          : reject({ error: `Failed to update Country` }),
      100,
    );
  });

/**
 * Processor for updating country
 * @param country country to update
 * @returns boolean if update is successfull
 */
const processUpdateCountry = (country: Country): boolean => {
  let temp = countries.find(
    c => c.code === country.code || c.name === country.name,
  ) as Country;
  if (temp) {
    temp.code = country.code;
    temp.name = country.name;
    return true;
  }
  return false;
};

/**
 * API to delete country, sometimes this fails too.
 * @param country country to delete
 */
export const deleteCountry = (country: Country): Promise<boolean> =>
  new Promise((resolve, reject) => {
    setTimeout(
      () =>
        Math.round(Math.random()) === 0
          ? resolve(processDeleteCountry(country))
          : reject({ error: `Failed to delete Country` }),
      100,
    );
  });

/**
 * Processor for deleting country
 * @param country country to delete
 * @returns boolean if deletion is successfull
 */
const processDeleteCountry = (country: Country): boolean => {
  const countryIndex = countries.findIndex(c => c.code === country.code);
  if (countryIndex > -1) {
    countries.splice(countryIndex, 1);
    return true;
  }
  return false;
};
