import { Request, response, Response } from 'express';
import { Country } from '../types';
import redis from '../library/redis';

/**
 * API to country related operations
 *
 */
export const getCountry = async (req: Request, res: Response) => {
  const keys = await redis.keysAsync('*');
  const { query } = req;

  const refs = keys.map(async key => {
    const data = (await redis.getAsync(key)) as string;
    const { code, name, population } = JSON.parse(data) as Country;
    return {
      code,
      name,
      population,
    };
  });

  const results = await Promise.all(refs);

  if (query && query.sort === 'population') {
    results.sort((a, b) => b.population - a.population);
  }

  res.send(results);
};

export const updateCountry = async (req: Request, res: Response) => {
  const body = req.body as { code: string; population?: number; name?: string };

  if (!body.code) {
    res.status(400).json({ errors: 'No code parameter provided.' });
    return;
  }

  const isCodeExist = await redis.existsAsync(body.code);
  if (!isCodeExist) {
    res.status(400).json({ errors: 'Invalid code' });
    return;
  }

  const data = (await redis.getAsync(body.code)) as string;
  const updatedData = {
    ...(JSON.parse(data) as Country),
    ...(body.population ? { population: body.population } : {}),
    ...(body.name ? { name: body.name } : {}),
  };

  await redis.setAsync(body.code, JSON.stringify(updatedData));
  res.send({ status: 200, message: 'Country updated!' });
};

export const deleteCountry = async (req: Request, res: Response) => {
  if (!req.params.code) {
    res.status(400).json({ errors: 'No code provided!' });
  }

  const isCodeExist = await redis.existsAsync(req.params.code);
  if (!isCodeExist) {
    res.status(400).json({ errors: 'Invalid code' });
    return;
  }

  await redis.delAsync(req.params.code);

  res.status(200).end();
};
