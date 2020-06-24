import express from "express";
import authMiddleware from "../../middlewares/auth";
import * as handlers from "./handlers";

const router: express.Router = express.Router();

router.get("/", handlers.index);
router.post("/update/:id", authMiddleware, handlers.update);
router.delete("/destroy/:id", authMiddleware, handlers.remove);

export default router;
