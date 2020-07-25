import express from "express";
import * as authApi from "../api/authenticate";
import { logger } from "../utils/logger";

const authenticateRoute = express.Router();

authenticateRoute.post("/", async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res
      .status(400)
      .send({ status: "error", message: "No username or password provided" });

  authApi
    .authenticate(req.body.username, req.body.password)
    .then((authResult: boolean) => {
      if (authResult) {
        logger.info("User authenticated");
        return res
          .status(200)
          .send({ status: "success", message: "User authenticated" });
      }

      logger.error("Failed to authenticate User");
      return res
        .status(401)
        .send({ status: "error", message: "Failed to authenticate User" });
    })
    .catch(error => {
      logger.error(`Unexpected Error Occured: ${error.error}`);
      return res.status(500).send({ error: error.error });
    });
});

export default authenticateRoute;
