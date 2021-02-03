/**
 * Module Dependencies
 */
import Bluebird from 'bluebird';
import { NextFunction, Request, Response } from 'express';
import HTTPStatusCode from 'http-status-codes';
import _ from 'lodash';
import { ValidationError } from 'yup';

import CountryNotFoundError from 'domain/error/CountryNotFoundError';
import CountryService from 'domain/service/CountryService';
import HTTPError from 'rest/error/HTTPError';
import UpdateCountryPopulationRequest from 'rest/request/UpdateCountryPopulationRequest';
import UpdateCountryRequest from 'rest/request/UpdateCountryRequest';
import DeleteCountryResponse from 'rest/response/DeleteCountryResponse';
import GetCountryResponse from 'rest/response/GetCountryResponse';
import ListCountriesResponse from 'rest/response/ListCountriesResponse';
import UpdateCountryPopulationResponse from 'rest/response/UpdateCountryPopulationResponse';
import UpdateCountryResponse from 'rest/response/UpdateCountryResponse';

export default class CountryController {
  /**
   * Retrieves the specified country by code.
   *
   * @static
   * @param {Request<IParams>} req
   * @param {Response<GetCountryResponse>} res
   * @param {NextFunction} next
   * @return {*}  {Bluebird<void>}
   * @memberof CountryController
   */
  public static async get(
    req: Request<IParams>,
    res: Response<GetCountryResponse>,
    next: NextFunction,
  ): Bluebird<void> {
    Bluebird.try(() => CountryService.getByCode(req.params.code))
      .then(country => {
        if (country === null) {
          throw new CountryNotFoundError(req.params.code);
        }

        return res.json(new GetCountryResponse(country));
      })
      .catch(ValidationError, err =>
        next(new HTTPError(err.message, err.name, HTTPStatusCode.BAD_REQUEST)),
      )
      .catch(CountryNotFoundError, err =>
        next(new HTTPError(err.message, err.name, HTTPStatusCode.BAD_REQUEST)),
      )
      .catch(err => next(err));
  }

  /**
   * Retrieves the countries. It can be sorted by population.
   *
   * @static
   * @param {Request} req
   * @param {Response<ListCountriesResponse>} res
   * @param {NextFunction} next
   * @return {*}  {Bluebird<void>}
   * @memberof CountryController
   */
  public static async list(
    req: Request,
    res: Response<ListCountriesResponse>,
    next: NextFunction,
  ): Bluebird<void> {
    // TODO: Add pagination
    // TODO: Refactor the sorting algorithm
    Bluebird.try(() => CountryService.list())
      .then(countries => _.cloneDeep(countries))
      .then(countries => {
        if (req.query.population === '1') {
          return _.sortBy(
            countries,
            country => country.population ?? 0,
          ).reverse();
        }

        return countries;
      })
      .then(countries => {
        res.json(new ListCountriesResponse(countries));
      })
      .catch(err => next(err));
  }

  /**
   * Updates the specified country population.
   *
   * @static
   * @param {Request<IParams>} req
   * @param {Response<UpdateCountryPopulationResponse>} res
   * @param {NextFunction} next
   * @return {*}  {Bluebird<void>}
   * @memberof CountryController
   */
  public static async updatePopulation(
    req: Request<IParams>,
    res: Response<UpdateCountryPopulationResponse>,
    next: NextFunction,
  ): Bluebird<void> {
    Bluebird.try(() => UpdateCountryPopulationRequest.parse(req.body))
      .then(payload =>
        CountryService.updatePopulationByCode(
          req.params.code,
          payload.population,
        ),
      )
      .then(code => CountryService.getByCode(code))
      .then(country => {
        if (country === null) {
          throw new CountryNotFoundError(req.params.code);
        }

        return res.json(new UpdateCountryPopulationResponse(country));
      })
      .catch(ValidationError, err =>
        next(new HTTPError(err.message, err.name, HTTPStatusCode.BAD_REQUEST)),
      )
      .catch(CountryNotFoundError, err =>
        next(new HTTPError(err.message, err.name, HTTPStatusCode.BAD_REQUEST)),
      )
      .catch(err => next(err));
  }

  /**
   * Updates the population of a country.
   *
   * @static
   * @param {Request<IParams>} req
   * @param {Response<UpdateCountryResponse>} res
   * @param {NextFunction} next
   * @return {*}  {Bluebird<void>}
   * @memberof CountryController
   */
  public static async update(
    req: Request<IParams>,
    res: Response<UpdateCountryResponse>,
    next: NextFunction,
  ): Bluebird<void> {
    Bluebird.try(() => UpdateCountryRequest.parse(req.body))
      .then(payload => CountryService.updateByCode(req.params.code, payload))
      .then(code => CountryService.getByCode(code))
      .then(country => {
        if (country === null) {
          throw new CountryNotFoundError(req.params.code);
        }

        return res.json(new UpdateCountryResponse(country));
      })
      .catch(ValidationError, err =>
        next(new HTTPError(err.message, err.name, HTTPStatusCode.BAD_REQUEST)),
      )
      .catch(CountryNotFoundError, err =>
        next(new HTTPError(err.message, err.name, HTTPStatusCode.BAD_REQUEST)),
      )
      .catch(err => next(err));
  }

  /**
   * Deletes the specified country :(.
   *
   * @static
   * @param {Request<IParams>} req
   * @param {Response<DeleteCountryResponse>} res
   * @param {NextFunction} next
   * @return {*}  {Bluebird<void>}
   * @memberof CountryController
   */
  public static async delete(
    req: Request<IParams>,
    res: Response<DeleteCountryResponse>,
    next: NextFunction,
  ): Bluebird<void> {
    Bluebird.resolve()
      .then(() => CountryService.deleteByCode(req.params.code))
      .then(countries => {
        res.json(new DeleteCountryResponse(countries));
      })
      .catch(CountryNotFoundError, err =>
        next(new HTTPError(err.message, err.name, HTTPStatusCode.BAD_REQUEST)),
      )
      .catch(err => next(err));
  }
}

interface IParams {
  code: string;
}
