import express from "express";
import * as countryApi from "../api/country";
import { Country } from "../types";
import { logger } from "../utils/logger";

const countryRoute = express.Router();

countryRoute.get("/", async (req, res) => {
  let result: Array<Country> = [];

  countryApi
    .list()
    .then((countries: Country[]) => {
      result = countries;
      logger.info("Retrieved Country List");
      return res.status(200).send({
        status: "success",
        message: "Retrieved Country List",
        data: result,
      });
    })
    .catch(error => {
      logger.error(`Unexpected Error Occured: ${error.error}`);
      return res.status(500).send({ status: "error", message: error.error });
    });
});

countryRoute.get("/order/population", async (req, res) => {
  let result: Array<Country> = [];

  countryApi
    .list()
    .then((countries: Country[]) => {
      result = countries.sort(
        (a, b) => (a.population || 0) - (b.population || 0),
      ); // set population to zero if population property is undefined
      logger.info("Retrieved Country List");
      return res.status(200).send({
        status: "success",
        message: "Retrieved Country List",
        data: result,
      });
    })
    .catch(error => {
      logger.error(`Unexpected Error Occured: ${error.error}`);
      return res.status(500).send({ status: "error", message: error.error });
    });
});

countryRoute.post("/update/population", async (req, res) => {
  if (!req.body.code || !req.body.name || !req.body.population)
    return res
      .status(400)
      .send({ status: "error", message: `Invalid post data` });

  const country: Country = req.body as Country;

  countryApi
    .updatePopulation(country)
    .then((updateResult: boolean) => {
      if (updateResult) {
        logger.info(`Retrieved Country List`);
        return res.status(200).send({
          status: "success",
          message: `Country ${country.name}'s Population has been update to ${country.population}`,
        });
      }

      logger.error(`Failed to update Country ${country.name}'s Population`);
      return res.status(500).send({
        status: "error",
        message: `Failed to update Country ${country.name}'s Population`,
      });
    })
    .catch(error => {
      logger.error(`Unexpected Error Occured: ${error.error}`);
      return res.status(500).send({ status: "error", message: error.error });
    });
});

countryRoute.post("/update", async (req, res) => {
  if (!req.body.code || !req.body.name)
    return res
      .status(400)
      .send({ status: "error", message: `Invalid country data` });

  const country: Country = req.body as Country;

  countryApi
    .updateCountry(country)
    .then((updateResult: boolean) => {
      if (updateResult) {
        logger.info("Country has been updated");
        return res.status(200).send({
          success: "Country has been updated",
        });
      }
      logger.error("Failed to update Country");
      return res.status(500).send({
        error: "Failed to update Country",
      });
    })
    .catch(error => {
      logger.error(`Unexpected Error Occured: ${error.error}`);
      return res.status(500).send({ status: "error", message: error.error });
    });
});

countryRoute.post("/delete", async (req, res) => {
  if (!req.body.code)
    return res
      .status(400)
      .send({ status: "error", message: `Invalid country data` });

  const country: Country = req.body as Country;

  countryApi
    .deleteCountry(country)
    .then((updateResult: boolean) => {
      if (updateResult) {
        logger.info("Country has been successfully deleted");
        return res.status(200).send({
          success: `Country has been successfully deleted`,
        });
      }
      logger.error("Failed to delete country");
      return res.status(500).send({
        error: `Failed to delete Country`,
      });
    })
    .catch(error => {
      logger.error(`Unexpected Error Occured: ${error.error}`);
      return res.status(500).send({ status: "error", message: error.error });
    });
});

export default countryRoute;
