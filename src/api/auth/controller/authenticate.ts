import { Response, Request, NextFunction } from 'express'
import HttpStatus from 'http-status-codes'

const login = (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

const profile = (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

export default {
  login,
  profile,
}
