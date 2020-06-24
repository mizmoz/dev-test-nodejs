import { Router } from "express";
import country from "./api/country";

const router: Router = Router();

router.use("/country", country);

export default router;
