import express from "express";
import * as handlers from "./handlers";

const router: express.Router = express.Router();

router.post("/login", handlers.login);

export default router;
