import { Response, Request, NextFunction } from 'express'
import HttpStatus from 'http-status-codes'

import User from './../models/user.model'
import Country from './../models/country.model'

import countries from './../configs/country'

const seeder = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    await User.create({
      name: 'John Dave Decano',
      email: 'example@example.com',
      password: 'password',
    })
    await Country.insertMany(countries)
    res.json(countries)
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

export default seeder
