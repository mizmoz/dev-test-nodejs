import express, { Application, NextFunction, Request, Response } from "express";
import { createNodeRedisClient, WrappedNodeRedisClient } from "handy-redis";
import { HelloWorld } from "./api/helloWorld";
import { listCountries } from "./api/readCountry";
import { listPopSortedCountries } from "./api/readSortedCountry";
import { editPopulation } from "./api/updatePopulation";
import { editCountryName } from "./api/updateCountry";
import { deleteCountry } from "./api/deleteCountry";
import { repopulateRedis } from "./api/repopulateDataRedis";
import { authHandler } from "./api/authHandler";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      redisClient: WrappedNodeRedisClient;
    }
  }
}

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
  }

  private setConfig() {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb", extended: true }));
    const options = {
      host: "redis-server",
      port: 6379,
    };

    let client = createNodeRedisClient(options);
    global.redisClient = client;
    this.setRoutes();
  }

  private setRoutes(): void {
    this.app.get("/list", authHandler, listCountries);
    this.app.get("/listSorted", authHandler, listPopSortedCountries);
    this.app.patch("/editPop", authHandler, editPopulation);
    this.app.patch("/editCountry", authHandler, editCountryName);
    this.app.delete("/deleteCountry", authHandler, deleteCountry);
    this.app.post("/repop", authHandler, repopulateRedis);
    this.app.get("/", HelloWorld);
  }
}

export default new App().app;
