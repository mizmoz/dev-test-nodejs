import bodyParser from "body-parser";
import express, { Application } from "express";
import winston from "winston";

import routes from "./routes";

const PORT: number = Number(process.env.PORT || 3000);

const app: Application = express();
const logger = winston.createLogger({
  defaultMeta: { service: "api" },
  format: winston.format.json(),
  level: "info",
});

// @TODO: only do this for development mode.
logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
);

app.use(bodyParser.json());

app.use("/api/v1", routes);

app.listen(PORT, () => {
  logger.info(`API server is running at port: ${PORT}`);
});
