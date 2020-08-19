import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { mainRoutes } from './api'

const API_NAME = 'DEV NODEJS'
const API_PORT: number | string = process.env.PORT || 5000

const app: express.Application = express()

app.use(helmet())
app.use(compression())
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/api', mainRoutes)

app.listen(API_PORT, () => {
  console.log(`${API_NAME} listening on 0.0.0.0:${API_PORT}`)
})
