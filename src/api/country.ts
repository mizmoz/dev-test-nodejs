import { ICountry } from "../types";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Country } from "../database/entity/Country";
import { IOrder } from "../types";

/**
 * Country API
 */
class CountryAPI {
  /**
   * List all countries
   * 
   * @param order string (optional)     Order by field: name | code | population, Default: population
   * @param sort asc || desc (optional) Sort by ascending or descending
   */
  static getCountries = async (req: Request, res: Response) => {
    const { order: _order, sort } = req.query;
    let columnName = <string>_order || "population";
    let sorting = <"asc" | "desc">sort || "desc";
    let order = {} as IOrder;

    order[columnName] = `${sorting}`.toUpperCase();

    const countryRepo = getRepository(Country);
    try {
      const countries = await countryRepo.find({
        select: ["id", "name", "code", "population"],
        order: order
      });

      res.send(countries);

    } catch (error) {
      res.status(400).send(error);
    }
  };

  /**
   * Gets a country
   * 
   * @param id integer
   */
  static getCountry = async (req: Request, res: Response) => {
    const id = req.params.id;
    const countryRepo = getRepository(Country);
    try {
      const country = await countryRepo.findOneOrFail(id)

      res.send(country);
    } catch (error) {
      res.status(404).send(error);
    }
  };

  /**
   * Creates a country/countries
   * 
   * @param name string
   * @param code string
   * @param population integer
   */
  static createCountry = async (req: Request, res: Response) => {
    const { name, code, population } = <ICountry>req.body;
    const countryRepo = getRepository(Country);
    let country = new Country();

    country.name = name;
    country.code = code;
    country.population = population;

    try {
      await countryRepo.save(country);

      res.send({ data: country, message: "Successfully added new country" });
    } catch (error) {
      res.status(400).send(error);
    }
  };

  /**
   * Updates a country
   * 
   * @param name string
   * @param code string
   * @param population integer
   */
  static updateCountry = async (req: Request, res: Response) => {
    const { name, code, population } = <ICountry>req.body;
    const id = req.params.id;
    const countryRepo = getRepository(Country);
    let country: Country;

    if (!name && !code && !population) {
      res.status(200).send({ message: "Nothing to update" });
      return;
    }

    try {
      country = await countryRepo.findOneOrFail(id);

      // All fields are set to be optional that's why we need to validate if it's defined
      if (name) {
        country.name = name;
      }
      if (code) {
        country.code = code;
      }
      if (population) {
        country.population = population;
      }

      await countryRepo.save(country);

      res.send({ data: country, message: "Successfully updated country" });
    } catch (error) {
      res.status(404).send(error);
    }

  };

  /**
   * Deletes a country
   * 
   * @param id integer
   */
  static deleteCountry = async (req: Request, res: Response) => {
    const id = req.params.id;
    const countryRepo = getRepository(Country);

    try {
      await countryRepo.findOneOrFail(id);
    } catch (error) {
      res.status(404).send();
      return;
    }

    await countryRepo.delete(id);

    res.status(204).send();
  };
}

export default CountryAPI;
