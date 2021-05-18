import Router from '@koa/router'
import { Context } from 'koa'

import authenticate from '../authenticator'
import { getCountries, addCountry, deleteCountry, updateCountry } from './service'

const routes = new Router()

routes.get('/', async (ctx: Context) => {
  ctx.body = await getCountries(ctx.query.sortBy as string | undefined)
})
routes.post('/', async (ctx: Context) => {
  ctx.body = await addCountry(ctx.request.body)
  ctx.status = 201
})
routes.patch('/:id', async (ctx: Context) => {
  ctx.body = await updateCountry(ctx.params.id, ctx.request.body)
})
routes.delete('/:id', async (ctx: Context) => {
  await deleteCountry(ctx.params.id)
  ctx.status = 204
})

export default new Router().use('/countries', authenticate, routes.routes())
