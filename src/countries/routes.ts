import Router from '@koa/router'
import { Context } from 'koa'

import authenticate from '../authenticator'
import { getCountries, addCountry, deleteCountry } from './service'

const routes = new Router()

routes.get('/', async (ctx: Context) => {
  ctx.body = getCountries(ctx.query.sortBy as string | undefined)
})
routes.post('/', (ctx: Context) => {
  addCountry(ctx.request.body)
})
routes.patch('/', (ctx: Context) => {
  // addCategory(ctx.request.body)
})
routes.delete('/:code', (ctx: Context) => {
  deleteCountry(ctx.request.body)
})

export default new Router().use('/categories', authenticate, routes.routes())
