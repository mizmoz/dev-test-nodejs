import { Request, Response } from "express";
import HttpStatus from "http-status-codes";

import { ICountry } from "../../types";
import Country from "./../../models/country.model";
import { count } from "console";

export async function index(req: Request, res: Response) {
  try {
    const { sort_order: sortOrder, sort_by = "code" } = req.query;
    const sortBy: keyof ICountry = String(
      sort_by,
    ).toLowerCase() as keyof ICountry;

    const data = await Country.find({}).sort({
      [sortBy]: sortOrder || "asc",
    });

    res.json(data);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    // @TODO: Could be _id, but I went with code, for easier testing in postman
    const { code, population } = req.body;
    const country = await Country.findOne({ code });

    if (!country) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Not found" });
    } else {
      country.population = population;

      country.save();
    }

    res.json(country);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}
