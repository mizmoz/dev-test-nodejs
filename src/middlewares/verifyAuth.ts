import { Request, Response, NextFunction } from 'express';
const redisClient = require('../storage/redis');

export default async (req: Request, res: Response, next: NextFunction) => {
  const isAuthenticated = (await redisClient.get('isAuthorized')) === 'true';

  if (!isAuthenticated) {
    return res
      .status(401)
      .json({ message: 'Unauthorized Access. You must login your valid credentials first.', success: false });
  }

  return next();
}