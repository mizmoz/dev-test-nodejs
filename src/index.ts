import "reflect-metadata";

import { checkJwtKeys } from "./auth";
import { initializeRedis } from "./redis";
import { initializeApp } from "./app";

checkJwtKeys();

const port = process.env.PORT ?? 3000;
const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

const app = initializeApp();
initializeRedis(redisUrl).then(() => {
  app.listen(port, () => {
    console.log(`App is running on port ${port}.`);
  });
});
