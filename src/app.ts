import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import morgan from "morgan";
import { Container, Service } from "typedi";
import dotenv from "dotenv";

import { authorizationChecker } from "./auth";
import { UsersController } from "./controllers/UsersController";
import { CountriesController } from "./controllers/CountriesController";
import { AuthService } from "./services/AuthService";

dotenv.config();

@Service()
export class AppContainer {
  public app: any;

  constructor(app: any) {
    this.app = app;
  }
}

export const initializeApp = () => {
  Container.set(
    AuthService,
    new AuthService({
      privateKeyPath: process.env.JWT_PRIVATE_KEY_PATH!,
      publicKeyPath: process.env.JWT_PUBLIC_KEY_PATH!,
    }),
  );

  const app = createExpressServer({
    controllers: [UsersController, CountriesController],
    authorizationChecker,
  });

  app.use(morgan("combined"));

  Container.set(AppContainer, new AppContainer(app));

  return app;
};
