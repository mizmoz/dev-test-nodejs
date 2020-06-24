import { Router } from "express";
import country from "./api/country";
import setup from "./api/setup";

const router: Router = Router();

router.use("/country", country);
router.post("/setup", setup);

export default router;
