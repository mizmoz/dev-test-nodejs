import { Router } from "express";
import country from "./api/country";
import auth from "./api/auth";
import setup from "./api/setup";

const router: Router = Router();

router.use("/country", country);
router.use("/auth", auth);
router.post("/setup", setup);

export default router;
