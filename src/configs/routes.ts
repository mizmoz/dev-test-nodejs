import express from 'express';
import { migrate, list, update, remove } from '../controllers/country';
import { checkAuth } from '../controllers/authenticate';

const route = express.Router();

route.get("/countries", checkAuth, list);
route.post("/countries", checkAuth, migrate);
route.put("/countries", checkAuth, update);
route.delete("/countries", checkAuth, remove);

export default route;
