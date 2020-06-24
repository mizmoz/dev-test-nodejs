import bodyParser from "body-parser";
import express, { Application } from "express";
import expressWinston from "express-winston";
import mongoose from "mongoose";
import winston from "winston";

import routes from "./routes";

const PORT: number = Number(process.env.PORT || 3000);
const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/countrydb";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(err => {
    console.error(`Unable to connect to mongoDB: ${err.message}`);
    process.exit(1);
  });

const app: Application = express();

app.use(
  expressWinston.logger({
    colorize: false,
    expressFormat: true,
    format: winston.format.combine(winston.format.json()),
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}}",
    transports: [new winston.transports.Console()],
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`API server is running at port: ${PORT}`);
});
