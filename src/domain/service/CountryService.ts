/**
 * Module Dependencies
 */
import Bluebird from 'bluebird';

import redis from '@lib/redis';
import CountryNotFoundError from 'domain/error/CountryNotFoundError';

// TODO: Create a repository for countries

export default class CountryService {
  /**
   * Returns the specified country by code if it exists.
   *
   * @static
   * @param {string} code
   * @return {*}  {(Bluebird<ICountry | null>)}
   * @memberof CountryService
   */
  public static getByCode(code: string): Bluebird<ICountry | null> {
    return Bluebird.resolve()
      .then(() => redis.hget('country', code))
      .then(countryStr =>
        countryStr ? (JSON.parse(countryStr) as ICountry) : null,
      );
  }

  /**
   * Lists all countries.
   *
   * @static
   * @return {*}  {Bluebird<ICountry[]>}
   * @memberof CountryService
   */
  public static list(): Bluebird<ICountry[]> {
    return Bluebird.resolve()
      .then(() => redis.smembers('countries'))
      .map(countryId => redis.hget('country', countryId))
      .filter(countryStr => !!countryStr)
      .map((countryStr: string) => JSON.parse(countryStr) as ICountry);
  }

  /**
   * Updates the information of the country.
   *
   * @static
   * @param {string} code
   * @param {number} population
   * @return {*}  {Bluebird<string>}
   * @memberof CountryService
   */
  public static updateByCode(
    code: string,
    payload: IUpdateByCodePayload,
  ): Bluebird<string> {
    return this.getByCode(code)
      .then(country => {
        if (!country) {
          throw new CountryNotFoundError(code);
        }

        return country;
      })
      .tap(country =>
        redis.hset('country', code, JSON.stringify({ ...country, ...payload })),
      )
      .then(() => code);
  }

  /**
   * Updates the population of the specified country.
   *
   * @static
   * @param {string} id
   * @param {number} population
   * @return {*}  {Bluebird<string>}
   * @memberof CountryService
   */
  public static updatePopulationByCode(
    code: string,
    population: number,
  ): Bluebird<string> {
    return this.getByCode(code)
      .then(country => {
        if (!country) {
          throw new CountryNotFoundError(code);
        }

        return country;
      })
      .tap(country =>
        redis.hset('country', code, JSON.stringify({ ...country, population })),
      )
      .then(() => code);
  }

  /**
   * Deletes the specified country.
   *
   * @static
   * @param {string} code
   * @return {*}  {Bluebird<ICountry>}
   * @memberof CountryService
   */
  public static deleteByCode(code: string): Bluebird<ICountry> {
    return this.getByCode(code)
      .then(country => {
        if (!country) {
          throw new CountryNotFoundError(code);
        }

        return country;
      })
      .tap(() =>
        Bluebird.resolve(redis.pipeline())
          .tap(pipeline => pipeline.hdel('country', code))
          .tap(pipeline => pipeline.srem('countries', code))
          .tap(pipeline => pipeline.exec()),
      );
  }
}

interface IUpdateByCodePayload {
  name?: string;
  coordinates?: [number, number];
}
