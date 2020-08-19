import { NextFunction, Request, Response } from 'express'
import { body as checkBody, validationResult } from 'express-validator'
import HttpStatus from 'http-status-codes'

const validateCountry = (req: Request, res: Response, next: NextFunction) => {
  checkBody('name', 'Please provide your Country Name').notEmpty()
  checkBody('code', 'Please provide your Country Code').notEmpty()
  checkBody('population', 'Please provide your Country Population')
    .notEmpty()
    .isNumeric()

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      response: {
        msg: '',
        result: errors.array(),
        success: false,
      },
      statusCode: 400,
    })
  } else {
    return next()
  }
}

export default {
  validateCountry,
}
