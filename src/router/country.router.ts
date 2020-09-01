import express from "express";
import BaseRouter from "./base.router";
import CountryController from "../controller/country.controller";

class CountryRouter extends BaseRouter {
  constructor() {
    super();
    let _router = this.getRouter();
    let _countryController = new CountryController();

    //get all countries
    _router
      .get("/", _countryController.getAllCountry.bind(_countryController))
      .post("/", _countryController.addCountry.bind(_countryController));

    //get specific country by code
    _router
      .get("/:code", _countryController.getCountry.bind(_countryController))
      .put("/:code", _countryController.updateCountry.bind(_countryController))
      .delete(
        "/:code",
        _countryController.deleteCountry.bind(_countryController),
      );
  }
}

export default new CountryRouter();
