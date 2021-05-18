import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { connect } from './redis'
import countries from './countries/routes'

export const getApp = async () => {
  await connect()
  const app = new Koa()

  app.use(bodyParser()).use(countries.routes())

  return app
}
