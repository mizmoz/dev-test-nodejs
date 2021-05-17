import Router from '@koa/router'
import { Context } from 'koa'

import authenticate from '../authenticator'
import { getCountries, addCountry, deleteCountry, updateCountry } from './service'

const routes = new Router()

routes.get('/', async (ctx: Context) => {
  ctx.body = await getCountries(ctx.query.sortBy as string | undefined)
})
routes.post('/', async (ctx: Context) => {
  addCountry(ctx.request.body)
})
routes.patch('/:id', async (ctx: Context) => {
  updateCountry(ctx.params.id, ctx.request.body)
})
routes.delete('/:id', async (ctx: Context) => {
  deleteCountry(ctx.params.id)
})

export default new Router().use('/categories', /*authenticate,*/ routes.routes())
