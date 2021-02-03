import "reflect-metadata";
import dotenv from "dotenv";
import { createExpressServer, Action } from "routing-controllers";
import morgan from "morgan";
import redis from "redis";
import { Container } from "typedi";

import { checkJwtKeys, authorizationChecker } from "./auth";
import { UsersController } from "./controllers/UsersController";
import { CountriesController } from "./controllers/CountriesController";
import { AuthService } from "./services/AuthService";
import { RedisService } from "./services/RedisService";

dotenv.config();

checkJwtKeys();

Container.set(
  AuthService,
  new AuthService({
    privateKeyPath: process.env.JWT_PRIVATE_KEY_PATH!,
    publicKeyPath: process.env.JWT_PUBLIC_KEY_PATH!,
  }),
);

const redisClient = redis.createClient({
  url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
});
Container.set(RedisService, new RedisService(redisClient));

const app = createExpressServer({
  controllers: [UsersController, CountriesController],
  authorizationChecker,
});

app.use(morgan("combined"));

redisClient.on("ready", () => {
  console.log("Redis is connected.");

  const port = process.env.PORT ?? 3000;

  app.listen(port, () => {
    console.log(`App is running on port ${port}.`);
  });
});

redisClient.on("error", error => {
  console.error(error);
});
