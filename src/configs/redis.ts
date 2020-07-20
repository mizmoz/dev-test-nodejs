import redis from "redis";
import { REDIS_PORT } from "./constants";

const client = redis.createClient({
  host: "redis-server",
  port: REDIS_PORT,
});

export default client;
