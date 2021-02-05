import { Container } from "typedi";
import redis from "redis";

import { RedisService } from "./services/RedisService";

export const initializeRedis = (redisUrl: string) => {
  const redisClient = redis.createClient({
    url: redisUrl,
  });
  Container.set(RedisService, new RedisService(redisClient));

  redisClient.on("error", error => {
    console.error(error);
  });

  return new Promise<void>(resolve => {
    redisClient.on("ready", () => {
      resolve();
    });
  });
};
