import express from 'express'

import auth from './auth'

import country from './country'

const router: express.Router = express.Router()

router.use('/auth', auth)

router.use('/country', country)

export default router
