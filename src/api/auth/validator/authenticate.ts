import { NextFunction, Request, Response } from 'express'
import { body as checkBody, validationResult } from 'express-validator/check'
import HttpStatus from 'http-status-codes'

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  checkBody('lastname', 'Please provide your lastname').notEmpty()
  checkBody('firstname', 'Please provide your firstname').notEmpty()
  checkBody('username', 'Please provide your username').notEmpty()
  checkBody('password', 'Please provide your password').notEmpty()

  const errors = validationResult(req).mapped()
  if (errors) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      response: {
        msg: '',
        result: errors,
        success: false,
      },
      statusCode: 400,
    })
  } else {
    return next()
  }
}

export default {
  validateLogin,
}
