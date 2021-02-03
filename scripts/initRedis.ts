import process from "process";
import dotenv from "dotenv";
import redis from "redis";

import countries from "../src/configs/country";

dotenv.config();

if (!(process.env.DEV_INIT_REDIS === "true")) {
  process.exit(0);
}

const redisClient = redis.createClient({
  url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
});

redisClient.on("ready", () => {
  console.log("Redis is connected.");

  for (const c of countries) {
    redisClient.zadd("countriesByPopulation", -1, `${c.code}`);
    redisClient.hmset(`country.${c.code}`, "name", c.name);
  }

  console.log("Redis instance populated with data.");
  process.exit(0);
});

redisClient.on("error", error => {
  throw error;
});
