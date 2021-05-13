import Router from '@koa/router'
import authenticate from '../authenticate'

const routes = new Router()

routes.get('/')
routes.put('/')

export default new Router().use('/categories', authenticate, routes.routes())
