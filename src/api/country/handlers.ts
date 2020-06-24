import { Request, Response } from "express";
import HttpStatus from "http-status-codes";

import { ICountry } from "../../types";
import Country from "./../../models/country.model";

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
    const { _id, ...rest } = req.body;
    const country = await Country.findOneAndUpdate({ _id }, rest);

    if (!country) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Not found" });
    }

    res.json(country);
  } catch (error) {
    // @TODO: Change to custom message to prevent displaying actual mongoose error message
    // only save mongoose message to internal log file.
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}
