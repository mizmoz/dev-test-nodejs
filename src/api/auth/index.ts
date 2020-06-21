import express from 'express'
import { validate } from 'express-validation'

import controller from './auth.controller'
import validator from './auth.validator'
import requireAuth from './../../middlewares/auth.middleware'

const router: express.Router = express.Router()

router.get('/me', requireAuth, controller.show)
router.post('/login', requireAuth, validate(validator.login), controller.login)

export default router
