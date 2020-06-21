import { Response, Request, NextFunction } from 'express'

import HttpStatus from 'http-status-codes'

import Country, { ICountry } from './../../models/country.model'

import Cache from './../../utils/cache'

interface IParams {
  code?: string
  name?: string
}

const index = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const cached = await Cache.get('countries')

    if (cached) {
      res.json(cached)
      return
    }

    const params: IParams = {}

    if (req.query.code && req.query.code !== '') {
      params.code = req.query.code as string
    }

    if (req.query.name && req.query.name !== '') {
      params.name = req.query.code as string
    }

    const results = await Country.find(params).sort('code')

    await Cache.set('countries', results)

    res.json(results)
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

const create = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const country: ICountry = new Country()

    country.code = req.body.code
    country.name = req.body.name

    await country.save()

    res.json(country)
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

const show = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const country: ICountry | null = (await Country.findOne({
      _id: req.params.id,
    })) as ICountry

    if (!country) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Resource was not found' })
      return
    }

    res.json(country)
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

const update = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const country: ICountry | null = (await Country.findOne({
      _id: req.params.id,
    })) as ICountry

    if (!country) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Resource was not found' })
      return
    }

    country.code = req.body.code
    country.name = req.body.name

    await country.save()

    res.json(country)
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

const destroy = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const country: ICountry | null = (await Country.findOne({
      _id: req.params.id,
    })) as ICountry

    if (!country) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Resource was not found' })
      return
    }

    await country.remove()

    res.json(country)
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

export default {
  index,
  show,
  create,
  update,
  destroy,
}
