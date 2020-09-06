
import { Request, Response, Router } from 'express';
import * as CountryService from '../api/country';

const router = Router();

router.get('/', (req: Request, res: Response) => {

  res.json({message: 'node developer test api'});
});

router.get('/countries', async (req: Request, res: Response) => {

  const countries = await CountryService.all();
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
  await CountryService.update(req.params.code, req.body);
});

export default router;