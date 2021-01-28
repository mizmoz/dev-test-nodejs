
import fastify from "fastify";
import redis from "fastify-redis";
import serialize from "fast-safe-stringify";

import router from "./api/country/router";
import countries from "./configs/country";

const server = fastify();
const PORT = 8080;

server.register(redis, {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379
});

server.register(router);

server.get("/", async () => {
  return {
    name: "Node Test API",
    version: "0.0.1"
  }
});

server.ready(err => {
  if (err) return console.log(err);
  
  // load country list in redis
  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    const population = 0;

    server.redis.set(country.name, serialize(country));
    server.redis.zadd("country", population, country.name);
  }

  server.listen(PORT);
  console.log("Running in", PORT);
})
