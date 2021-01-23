import express, { Application, Request, Response } from "express";
import { Country } from "./types";
import { orderBy, findIndex, isNaN } from "lodash";

import authMiddleware from "./middlewares/auth";
import countryDb from "./api/country";

const main = async () => {
  let countries: Country[] = await countryDb();

  const app: Application = express();

  app.use(authMiddleware);

  app.get("/", (req: Request, res: Response) => {
    res.send("Welcome");
  });

  app.get("/countries", (req: Request, res: Response) => {
    res.send(countries);
  });

  app.get("/sort/:order", (req: Request, res: Response) => {
    if (req.params.order !== "asc" && req.params.order !== "desc")
      return res.send("Order should be asc/desc");

    res.send(orderBy(countries, ["population"], [req.params.order]));
  });

  app.put(
    "/update/population/:code/:population",
    (req: Request, res: Response) => {
      const index: number = findIndex(countries, ["code", req.params.code]);

      if (index < 0) return res.send("Country code does not exist.");
      const population: any = parseInt(req.params.population);

      if (isNaN(population)) return res.send("Population should be a number.");

      countries[index].population = population;

      res.send(countries[index]);
    },
  );

  app.put("/update/country/:code/:name", (req: Request, res: Response) => {
    const index: number = findIndex(countries, ["code", req.params.code]);

    if (index < 0) return res.send("Country code does not exist.");

    countries[index].name = req.params.name;
    res.send(countries[index]);
  });

  app.delete("/delete/country/:code", (req: Request, res: Response) => {
    const index: number = findIndex(countries, ["code", req.params.code]);

    if (index < 0) return res.send("Country code does not exist.");

    countries.splice(index, 1);

    res.send(countries);
  });

  const httpServer = app.listen(8000, () =>
    console.log("Server running on port 8000"),
  );

  return { httpServer };
};

export default main;
