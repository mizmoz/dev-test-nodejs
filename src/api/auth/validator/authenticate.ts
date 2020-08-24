import { NextFunction, Request, Response } from 'express'
import { body as checkBody, validationResult } from 'express-validator/check'
import HttpStatus from 'http-status-codes'
import isEmpty from 'lodash/isEmpty'

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization

  const uname = {
    param: 'username',
    message: 'Please provide your Username',
  }

  const pword = {
    param: 'password',
    message: 'Please provide your Password',
  }

  if (!auth) {
    res.status(HttpStatus.BAD_REQUEST).send({
      result: [uname, pword],
      message: '',
      success: false,
    })
  } else if (auth) {
    const tmp = auth.split(' ')
    const buf = new Buffer(tmp[1], 'base64')
    const plain_auth = buf.toString()
    const creds = plain_auth.split(':')
    const username = creds[0]
    const password = creds[1]

    if (isEmpty(username) && isEmpty(password)) {
      res.status(HttpStatus.BAD_REQUEST).send({
        result: [uname, pword],
        message: '',
        success: false,
      })
    } else if (isEmpty(username) && !isEmpty(password)) {
      res.status(HttpStatus.BAD_REQUEST).send({
        result: [uname],
        message: '',
        success: false,
      })
    } else if (!isEmpty(username) && isEmpty(password)) {
      res.status(HttpStatus.BAD_REQUEST).send({
        result: [pword],
        message: '',
        success: false,
      })
    } else if (username === 'undefined' && password === 'undefined') {
      res.status(HttpStatus.BAD_REQUEST).send({
        result: [uname, pword],
        message: '',
        success: false,
      })
    } else if (!isEmpty(username) && password === 'undefined') {
      res.status(HttpStatus.BAD_REQUEST).send({
        result: [pword],
        message: '',
        success: false,
      })
    } else if (username === 'undefined' && !isEmpty(password)) {
      res.status(HttpStatus.BAD_REQUEST).send({
        result: [uname],
        message: '',
        success: false,
      })
    } else {
      next()
    }
  }
}

export default {
  validateLogin,
}
