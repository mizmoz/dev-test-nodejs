import restify from 'restify'
import {Request, Response, Next} from 'restify'
import corsMiddleware from 'restify-cors-middleware'
import country from './api/country'

const server = restify.createServer()

//cors
const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['*'],
    exposeHeaders: ['*']
})
server.pre(cors.preflight)
server.use(cors.actual)

const getAll =
    (req: Request, res: Response, next: Next) => 
        country()
        .then(countries => {
            res.send(countries)
            next()
        })
        .catch(err => {
            next(new Error('Something went wrong.'))
        })

server.get('/countries', getAll)

server.listen(7000, () => {
    console.log('%s listening at %s', 'test', 'test');
})

/*
* Graceful termination */
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated.')
        process.exit(0)
    })
})