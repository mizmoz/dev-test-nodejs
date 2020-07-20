import { Router } from "express";
import CountryAPI from "../api/country";

const router = Router();

// gets all countries
router.get("/", CountryAPI.getCountries);

// gets a country
router.get("/:id", CountryAPI.getCountry);

// creates a country
router.post("/", CountryAPI.createCountry);

// updates a country
router.patch("/:id", CountryAPI.updateCountry);

// deletes a country
router.delete("/:id", CountryAPI.deleteCountry);

export default router;
