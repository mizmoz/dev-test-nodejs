import { Request, Response } from "express";
import HttpStatus from "http-status-codes";

import { ICountry } from "../../types";
import Country from "../../models/country.model";
import * as cache from "../../helpers/cache";

export async function index(req: Request, res: Response) {
  try {
    const cached = await cache.get("countries");

    if (cached) {
      res.json(cached);
      return;
    }

    const { sort_order: sortOrder, sort_by = "code" } = req.query;
    const sortBy: keyof ICountry = String(
      sort_by,
    ).toLowerCase() as keyof ICountry;

    const data = await Country.find({}).sort({
      [sortBy]: sortOrder || "asc",
    });

    cache.set("countries", data);

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
    const _id: string = req.params.id;
    const country = await Country.findOneAndUpdate({ _id }, req.body);

    if (!country) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Not found" });
      return;
    }

    cache.del("countries");

    res.json(country);
  } catch (error) {
    // @TODO: Change to custom message to prevent displaying actual mongoose error message
    // only save mongoose message to internal log file.
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    // @TODO: Could be _id, but I went with code, for easier testing in postman
    const _id: string = req.params.id;
    const country = await Country.findOneAndRemove({ _id });

    if (!country) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Not found" });
      return;
    }

    cache.del("countries");

    res.json({ message: `${country.code} has been removed` });
  } catch (error) {
    // @TODO: Change to custom message to prevent displaying actual mongoose error message
    // only save mongoose message to internal log file.
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}
