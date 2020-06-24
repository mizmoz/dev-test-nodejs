import { Request, Response } from "express";

import countries from "../../configs/country";
import { ICountry } from "../../types";

export function index(req: Request, res: Response) {
  const { sort_order: sortOrder, sort_by = "population" } = req.query;
  let data = countries as any; // @HACK: This is only while we're not using db

  if (typeof sortOrder !== "undefined") {
    const sortBy: keyof ICountry = String(
      sort_by,
    ).toLowerCase() as keyof ICountry;

    data = data.sort((left: ICountry, right: ICountry) => {
      const modifier = sortOrder === "asc" ? -1 : 1;
      return left[sortBy] > right[sortBy] ? -1 * modifier : 1 * modifier;
    });
  }

  res.json(data);
}
