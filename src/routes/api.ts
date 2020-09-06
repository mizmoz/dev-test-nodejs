import { Request, Response, Router } from 'express';
import * as CountryService from '../api/country';
import { QueryParams } from '../types';
import { authenticate, verifyToken } from '../api/authenticate';

const router = Router();

// JWT
router.use(['/countries', '/countries/:code'], (req: Request, res: Response, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null || !verifyToken(token)) {
    res.status(401);
    return res.json({message: 'Authentication failure'});
  } // if there isn't any token

  next();
});


router.get('/', (req: Request, res: Response) => {

  res.json({message: 'node developer test api'});
});

router.get('/countries', async (req: Request, res: Response) => {

  const countries = await CountryService.all(req.query as QueryParams);
  res.json(countries);
});


router.get("/countries/:code", async (req: Request, res: Response) => {

  const country = await CountryService.get(req.params.code);
  if (!country) {
    res.status(404);
    res.json({error: 'country not found'});
    return;
  }

  res.json(country);
});

router.put("/countries/:code", async (req: Request, res: Response) => {

  const result = await CountryService.update(req.params.code, req.body);
  res.json(result);
});


router.delete("/countries/:code", async (req: Request, res: Response) => {
  const result = await CountryService.remove(req.params.code);
  res.json(result);
});


router.post("/login", async(req: Request, res: Response) => {
  const token = await authenticate(req.body.username, req.body.password);
  if (!token) {
    res.status(401);
    res.json({message: 'Authentication failure'})
    return;
  }

  res.json({ token });
});


export default router;