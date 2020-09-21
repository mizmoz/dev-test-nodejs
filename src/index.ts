require('dotenv').config()

import restify from 'restify'
import corsMiddleware from 'restify-cors-middleware'
import routes from './api/route/index'
import countries from "./configs/country";
import mongoose from 'mongoose'

const {
    PORT,
    DB,
    DB_NAME
} = process.env

const DB_OPTIONS = {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}

const server = restify.createServer()

const DB_CALLBACK = async (err: Error) => {
    const c_count = await mongoose.connection.db.collection('countries').countDocuments()

    if(c_count === 0)
        await mongoose.connection.db.collection('countries').insertMany(countries)
        
    console.log('DB SUCCESS!!!')
}

/*
* Database Connection */
mongoose.connect(DB!, DB_OPTIONS, DB_CALLBACK)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '))

//cors
const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['*'],
    exposeHeaders: ['*']
})
server.pre(cors.preflight)
server.use(cors.actual)

//parsers
server.use(restify.plugins.bodyParser({
    mapParams: true
}))
server.use(restify.plugins.queryParser({
    mapParams: true
}))

//custom
server.use((req, res, next) => {
    let { params } = req

    const {
        id
    } = params

    if(id)
        params._id = id

    req.params = params

    return next()
})

routes(server)

server.listen(PORT, () => {
    console.log('%s listening at %s', server.name, server.url);
})

/*
* Graceful termination */
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated.')
        process.exit(0)
    })
})