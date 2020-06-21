import { Response, Request, NextFunction } from 'express'

import HttpStatus from 'http-status-codes'

const login = (_req: Request, res: Response, _next: NextFunction) => {
  try {
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

const show = (_req: Request, res: Response, _next: NextFunction) => {
  try {
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

export default {
  login,
  show,
}
