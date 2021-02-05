import { Container, Service } from "typedi";
import { RedisClient } from "redis";
import { InternalServerError, BadRequestError } from "routing-controllers";

import { RedisService } from "./RedisService";

@Service()
export class CountriesService {
  private client: RedisClient;

  constructor() {
    this.client = Container.get(RedisService).client;
  }

  async getCountries(sort?: "asc" | "desc") {
    const getCountries = new Promise<{ [k: string]: { name: string } }>(
      (resolve, reject) => {
        this.client.keys("country.*", (err, keysReply) => {
          if (err) {
            reject(err);
          }

          const countries: { [k: string]: { name: string } } = {};

          this.client
            .batch(
              keysReply.map(key => {
                return ["HGETALL", key];
              }),
            )
            .exec((err, batchReplies) => {
              if (err) {
                reject(err);
              }

              batchReplies.forEach((reply, index) => {
                const [_, code] = keysReply[index].split(".");
                countries[code] = reply;
              });

              resolve(countries);
            });
        });
      },
    );

    const getPopulations = new Promise<string[]>((resolve, reject) => {
      if (sort === "asc") {
        this.client.zrange(
          "countriesByPopulation",
          0,
          -1,
          "WITHSCORES",
          (err, data) => {
            if (err) {
              reject(err);
            }
            resolve(data);
          },
        );
      } else {
        this.client.zrevrange(
          "countriesByPopulation",
          0,
          -1,
          "WITHSCORES",
          (err, data) => {
            if (err) {
              reject(err);
            }
            resolve(data);
          },
        );
      }
    });

    try {
      const [countryData, populationData] = await Promise.all([
        getCountries,
        getPopulations,
      ]);
      const countries = [];

      for (let i = 0; i < populationData.length; i++) {
        if (i % 2 === 0) {
          const code = populationData[i];
          const population = parseInt(populationData[i + 1], 10);
          const country = countryData[code];

          countries.push({
            code,
            name: country.name,
            population: population > -1 ? population : null,
          });
        }
      }

      return countries;
    } catch (e) {
      console.error(e);
      throw new InternalServerError("Could not retrieve countries.");
    }
  }

  async createCountry({
    code,
    name,
    population,
  }: {
    code: string;
    name: string;
    population?: number;
  }) {
    const countryCode = code.toLowerCase();

    const operations: string[][] = [
      ["HSETNX", `country.${countryCode}`, "name", name],
      [
        "ZADD",
        "countriesByPopulation",
        "NX",
        population?.toString() ?? "-1",
        countryCode,
      ],
    ];

    return new Promise((resolve, reject) => {
      this.client.multi(operations).exec((err, replies) => {
        if (err) {
          reject(new InternalServerError("Could not save country."));
        }

        if (replies[0] === 0 || replies[1] === 0) {
          reject(new BadRequestError("Country code already exists."));
        }

        resolve({
          code: countryCode,
          name,
          population,
        });
      });
    });
  }

  async updateCountry(
    countryCode: string,
    { name, population }: { name?: string; population?: number },
  ) {
    const countryCodeKey = countryCode.toLowerCase();
    const operations: string[][] = [];

    if (typeof name === "string") {
      operations.push(["HSET", `country.${countryCodeKey}`, "name", name]);
    }

    if (typeof population === "number") {
      operations.push([
        "ZADD",
        "countriesByPopulation",
        population.toString(),
        countryCodeKey,
      ]);
    }

    return new Promise((resolve, reject) => {
      this.client.multi(operations).exec((err, replies) => {
        if (err) {
          reject(new InternalServerError("Could not update country."));
        }

        resolve({ code: countryCodeKey });
      });
    });
  }

  async deleteCountry(countryCode: string) {
    const countryCodeKey = countryCode.toLowerCase();

    return new Promise((resolve, reject) => {
      this.client
        .multi([
          ["ZREM", "countriesByPopulation", countryCodeKey],
          ["DEL", `country.${countryCodeKey}`],
        ])
        .exec((err, replies) => {
          if (err) {
            reject(new InternalServerError("Could not delete country."));
          }

          if (replies[0] === 0 || replies[1] === 0) {
            reject(new BadRequestError("Country code not found."));
          }

          resolve(replies);
        });
    });
  }
}
