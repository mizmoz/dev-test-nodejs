import express from 'express'

import auth from './auth'

import country from './country'

import seeder from './seeder'

const router: express.Router = express.Router()

router.use('/auth', auth)

router.use('/country', country)

router.post('/seeder', seeder)

export default router
