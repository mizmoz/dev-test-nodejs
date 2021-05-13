import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'

import countries from './countries/routes'

const app = new Koa()
const router = new Router()

app.use(bodyParser()).use(countries.routes())

app.listen(3000)
