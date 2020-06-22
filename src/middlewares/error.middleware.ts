import { GeneralError } from './../utils/errors'

import { Request, Response, NextFunction } from 'express'

const handleErrors = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      message: err.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: err.message,
  })
}

export default handleErrors
