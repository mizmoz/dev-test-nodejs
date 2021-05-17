import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'

import { connect } from './redis'
import countries from './countries/routes'

const startApp = async () => {
  await connect()
  const app = new Koa()
  const router = new Router()

  app.use(bodyParser()).use(countries.routes())

  app.listen(3000)
  console.log('App starter')
}

startApp()
