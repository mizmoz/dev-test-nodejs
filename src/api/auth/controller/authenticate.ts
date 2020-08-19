import { NextFunction, Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import authenticate from '../services/authenticate'

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf('Basic ') === -1
    ) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Missing Authorization Header', success: false })
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii',
    )
    const [username, password] = credentials.split(':')
    const auth = await authenticate(username, password)
    if (!auth) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid Authentication Credentials', success: false })
    }

    res.status(HttpStatus.OK).send({
      message: 'Authentication Success',
      success: true,
    })
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

export default {
  login,
}
