import {Callback as RedisCallback, RedisClient} from "redis";
import {SortOrder} from "../types";

export interface ICountry {
  name: string
  code: string
  population: number
}

export interface ICountryModelOptions {
  redisClient: RedisClient
}

export enum SortableFields {
  NAME = "name",
  CODE = "code",
  POPULATION = "population"
}

export class Country {
  public redisClient: RedisClient;

  private key: string;

  constructor(options: ICountryModelOptions) {
    if (!options.redisClient) {
      throw new Error("Redis client not specified");
    }

    this.key = "country";
    this.redisClient = options.redisClient;
  }
  

  public setCountry(name: string, code: string, population: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redisClient.hmset(
        this.key, 
        code, 
        JSON.stringify({
          name,
          population
        }), 
        (err, reply) => {
          if (err) {
            return reject(err);
          }

          resolve(reply);
        }
      );
    });
  }

  public getCountries(options?: {
    sort: string,
    sortOrder?: SortOrder
  }): Promise<ICountry[]> {
    return new Promise((resolve, reject) => {
      this.redisClient.hgetall(this.key, (err, replies) => {
        if (err) {
          return reject(err);
        }

        const countries: ICountry[] = [];

        Object.keys(replies).sort().forEach(code => {
          const { name, population } = JSON.parse(replies[code]);
          countries.push({ name, code, population });
        });

        if (options && options.sort === SortableFields.POPULATION) {
          return resolve(
            countries.sort((a: ICountry, b: ICountry): number => {
              if (options.sortOrder === SortOrder.DESCENDING) {
                return b.population - a.population;
              }

              return a.population - b.population;
            })
          );
        }

        resolve(countries);
      });
    });
  }
}
