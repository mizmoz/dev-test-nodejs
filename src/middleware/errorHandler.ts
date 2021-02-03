/**
 * Module Dependencies
 */
import express from 'express';
import HTTPStatusCode from 'http-status-codes';

import HTTPError from 'rest/error/HTTPError';

export default () => (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  if (err instanceof HTTPError) {
    res.status(err.status);
    res.json({ code: err.code, message: err.message });
    return;
  }

  res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR);
  res.json({
    code: 'InternalServerError',
    message: 'Internal server error',
    error: req.app.get('env') !== 'production' ? err : undefined,
  });
};
