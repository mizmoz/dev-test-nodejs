import { Request, Response } from "express";

import countries from "../../configs/country";

export function index(_: Request, res: Response) {
  res.json(countries);
}
