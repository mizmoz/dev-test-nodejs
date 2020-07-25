import express from "express";
import cluster from "cluster";
import bodyParser from "body-parser";
import os from "os";
import { logger } from "./utils/logger";
import { config } from "./config";
import * as country from "./api/country";
import countryRoutes from "./routes/country-route";

const app = express();
const router = express.Router();

const runWorkers = () => {
  if (cluster.isMaster) {
    // create a worker for each CPU
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
    cluster.on("online", worker => {
      logger.info(`worker online, worker id: ${worker.id}`);
    });
    //if worker dies, create another one
    cluster.on("exit", (worker, code, signal) => {
      logger.error(
        `worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`,
      );
      cluster.fork();
    });
  }
};

if (cluster.isMaster) {
  // create a worker for each CPU
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
  cluster.on("online", worker => {
    logger.info(`worker online, worker id: ${worker.id}`);
  });
  //if worker dies, create another one
  cluster.on("exit", (worker, code, signal) => {
    logger.error(
      `worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`,
    );
    cluster.fork();
  });
} else {
  app.use(bodyParser.json());
  app.use("/api/country", countryRoutes);

  /**
   * Address Routes End
   */
  app.listen(config.port, function() {
    logger.info(
      `worker started: ${cluster.worker.id} | server listening on port: ${config.port}`,
    );
  });
}
