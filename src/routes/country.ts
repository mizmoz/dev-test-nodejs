import {Request, Response, Router} from "express";

import CountryAPI from "../api/country";
import {SortableFields} from "../models/country.model";
import {SortOrder} from "../types";

export default function countryRoute() {
  const router = Router();
  const api = new CountryAPI();

  router.get("/", async (req: Request, res: Response) => {
    try {
      const { 
        sort,
        sortOrder
      }: { 
        sort?: SortableFields,
        sortOrder?: SortOrder
      } = req.query;

      if (sort) {
        return res.json(await api.sortedList(sort, sortOrder));
      }

      const countries = await api.list();

      res.json(countries);
    } catch {
      res.status(500).send("Something went wrong");
    }
  });

  return router;
}



