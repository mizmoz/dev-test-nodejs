import dotenv from "dotenv";
import redis from "redis";

dotenv.config();

import {
  Country,
  ICountry,
  SortableFields
} from "../models/country.model";
import {SortOrder} from "../types";

export default class CountryAPI {
  private model: Country;

  constructor() {
    this.model = new Country({ redisClient: redis.createClient() });
  }

  public async list(): Promise<ICountry[]> {
    const countries = await this.model.getCountries();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.round(Math.random()) === 0) {
          return resolve(countries);
        }

        reject();
      }, 100);
    });
  }

  public sortedList(sort: SortableFields, sortOrder?: SortOrder): Promise<ICountry[]> {
    return this.model.getCountries({
      sort,
      sortOrder
    });
  }
}
