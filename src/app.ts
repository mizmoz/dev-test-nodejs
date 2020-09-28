import express, {Express} from "express";

import countryRoute from "./routes/country";

export default function createApp(): Express {
  const app = express();

  app.use("/country", countryRoute());

  return app;
}


