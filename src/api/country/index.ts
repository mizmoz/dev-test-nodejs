import express from "express";
import * as handlers from "./handlers";

const router: express.Router = express.Router();

router.get("/", handlers.index);
router.post("/update/:id", handlers.update);
router.delete("/destroy/:id", handlers.remove);

export default router;
