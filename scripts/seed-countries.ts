import dotenv from "dotenv";
import redis from "redis";

dotenv.config();

import countries from "../src/configs/country";
import {ICountry} from "../src/models/country.model";

const { REDIS_PORT }: { REDIS_PORT?: number } = process.env;

function seedCountries() {
  const redisCountryKey = "country";
  const redisClient = redis.createClient({ port: REDIS_PORT });

  countries.forEach((country: ICountry) => {
    country.population = Math.round(Math.random() * 1000000);

    if (!redisClient.hexists(redisCountryKey, country.code)) {
      redisClient.hset(redisCountryKey, country.code, JSON.stringify(country));
    }
  });

  redisClient.multi()
    .hgetall(redisCountryKey)
    .hlen(redisCountryKey)
    .exec((err, replies) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }

      console.log(replies);
      process.exit();
    });
}

seedCountries();
