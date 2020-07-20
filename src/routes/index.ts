import { Router } from "express";
import home from "./home";
import auth from "./auth";
import countries from "./countries";

const routes = Router();

routes.use("/", home);
routes.use("/auth", auth);
routes.use("/countries", countries);

export default routes;
