import express from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import authenticate from '../api/authenticate';

/**
 * Basic Auth Middleware
 * @param req
 * @param res
 * @param next
 */
export const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { authorization } = req.headers;

  if (authorization) {
    const credentials: string = authorization!.split(' ')[1];
    const [username, password]: string[] = Buffer.from(credentials, 'base64')
      .toString().split(':');
    const isAuthorized: boolean = await authenticate(username, password);

    if (isAuthorized) {
      return next();
    }
  }

  res.status(UNAUTHORIZED).json({
    message: 'Unauthorized',
  });
};