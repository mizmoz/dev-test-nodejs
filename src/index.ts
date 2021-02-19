import dotenv from 'dotenv'
import express from 'express'
import auth from './api/authenticate'
import authRouter from './routes/authentication'
import countriesRouter from './routes/countries'
import countryPopulationsRouter from './routes/countryPopulations'
import verifyToken from './verifyToken'

dotenv.config()

const app = express()

app.use(express.json())
    .use('/api/auth', authRouter)
    .use('/api/countries', verifyToken, countriesRouter)
    .use('/api/countryPopulations', verifyToken, countryPopulationsRouter)

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(`Listening to port ${PORT}`)
})
