import { Router } from "express";
import { Auth } from "../api/auth";

const router = Router();

router.post("/login", Auth.login);

export default router;
