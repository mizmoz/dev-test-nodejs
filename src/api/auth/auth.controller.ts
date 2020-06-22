import { Response, Request, NextFunction } from 'express'

import HttpStatus from 'http-status-codes'

import jwt from 'jsonwebtoken'

import User, { IUser } from './../../models/user.model'

const APP_SECRET = process.env.APP_SECRET || 'eDlXOuzbKUTJ6fJXjjLcPagU6Lg8uAcp'

/**
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} _next
 */
const login = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const user: IUser = (await User.findOne({ email: req.body.email })) as IUser

    if (!user) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid login credentials' })
      return
    }

    const isMatch: boolean = user.comparePassword(req.body.password)

    if (!isMatch) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid password' })
      return
    }

    return res.json({ token: jwt.sign({ _id: user._id }, APP_SECRET) })
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

export interface IUserRequest extends Request {
  user?: any
}

/**
 * @param  {IUserRequest} req
 * @param  {Response} res
 * @param  {NextFunction} _next
 */
const show = async (req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
    const user: IUser = (await User.findOne({
      email: req.user._id,
    })) as IUser

    res.json(user)
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

export default {
  login,
  show,
}
