import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import api from './api'
import errorHandler from './middlewares/error.middleware'

const API_NAME = 'Country Service'
const API_VERSION = 'v1'
const API_PORT: number | string = process.env.PORT || 5000
const MONGODB_URI: string =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test'

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(err => {
    console.error(err.message)
    console.error(`Unable to connect to mongoDB`)
    process.exit(1)
  })

const app: express.Application = express()

app.use(helmet())
app.use(compression())
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json(`Welcome to ${API_NAME} using version ${API_VERSION}`)
})

app.use('/api/v1', api)

app.use(errorHandler)

app.listen(API_PORT, () => {
  console.log(`${API_NAME} listening on 0.0.0.0:${API_PORT}`)
})
