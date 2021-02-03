/**
 * Module Dependencies
 */
import express from 'express';

import HTTPError from 'rest/error/HTTPError';

export default () => (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  if (err instanceof HTTPError) {
    next(err);
    return;
  }

  console.error(err);
  next(err);
};
