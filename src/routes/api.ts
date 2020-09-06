import { Request, Response, Router } from 'express';
import * as CountryService from '../api/country';
import { QueryParams } from '../types';
import { authenticate } from '../api/authenticate';

const router = Router();

router.get('/', (req: Request, res: Response) => {

  res.json({message: 'node developer test api'});
});

router.get('/countries', async (req: Request, res: Response) => {

  const countries = await CountryService.all(req.query as QueryParams);
  res.json(countries);
});


router.get("/countries/:code", async (req: Request, res: Response) => {
  console.log('SECRET', process.env.JWT_SECRET);
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
  res.json({ token });
});


export default router;