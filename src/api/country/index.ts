import express from "express";
import * as handlers from "./handlers";

const router: express.Router = express.Router();

router.get("/", handlers.index);

export default router;
