import express from "express";
import { mainController } from "../controllers/MainController";

class MainRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/countries", (req: express.Request, res: express.Response) =>
      mainController.getCountries(req, res)
    );

    this.router.get("/countries/pop/asc", (req: express.Request, res: express.Response) =>
      mainController.getCountriesAscPop(req, res)
    );

    this.router.get("/countries/pop/desc", (req: express.Request, res: express.Response) =>
      mainController.getCountriesDescPop(req, res)
    );

    this.router.get("/country/:id", (req: express.Request, res: express.Response) =>
      mainController.getCountryById(req, res)
    );

    this.router.put("/country/:id/pop", (req: express.Request, res: express.Response) =>
      mainController.updateCountryPop(req, res)
    );

    this.router.put("/country/:id", (req: express.Request, res: express.Response) =>
      mainController.updateCountry(req, res)
    );

    this.router.delete("/country/:id", (req: express.Request, res: express.Response) =>
      mainController.deleteCountryById(req, res)
    );

  }
}

export const mainRoutes = new MainRoutes().router;