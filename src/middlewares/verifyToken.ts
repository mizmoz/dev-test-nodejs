import { RequestHandler } from 'express';
import { Context, Errors, JWT } from '../utils';

export const verifyToken: RequestHandler = async (req, res, next) => {
  const { headers } = req;

  try {
    if (!headers?.authorization) {
      throw new Errors.UnauthorizedError('Unauthorized.')
    }

    const splittedAuth = headers.authorization.split(' ');
    // tslint:disable-next-line: tsr-detect-possible-timing-attacks
    if (splittedAuth[0] !== 'Bearer') {
      throw new Errors.UnauthorizedError('Unauthorized.')
    }

    const token = splittedAuth[1];
    const decoded = await JWT.verify(token);
    const ctx: Context = Context.get(req) || { username: '' };

    ctx.username = decoded;
    return next();
  } catch (error) {
    return next(error?.status ? error : new Errors.UnauthorizedError('Unauthorized.'));
  }
}
