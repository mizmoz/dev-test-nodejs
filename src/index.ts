import restify from 'restify'
import corsMiddleware from 'restify-cors-middleware'

const server = restify.createServer()

//cors
const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['*'],
    exposeHeaders: ['*']
})
server.pre(cors.preflight)
server.use(cors.actual)