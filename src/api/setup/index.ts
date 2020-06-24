import { Request, Response } from "express";
import HttpStatus from "http-status-codes";

import countries from "../../configs/country";
import Country from "../../models/country.model";

const setup = async (_: Request, res: Response) => {
  try {
    await Country.insertMany(
      countries.map((country: any) => ({ ...country, population: 0 })),
    );
    res.json(countries);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export default setup;
