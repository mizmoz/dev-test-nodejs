import express from "express";
import * as handlers from "./handlers";

const router: express.Router = express.Router();

router.get("/", handlers.index);
router.post("/update", handlers.update);

export default router;
