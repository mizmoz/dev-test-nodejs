import express from 'express'
import { validate } from 'express-validation'

import controller from './country.controller'
import validator from './country.validator'
import requireAuth from './../../middlewares/auth.middleware'

const router: express.Router = express.Router()

router.get('/', requireAuth, controller.index)
router.post('/', requireAuth, validate(validator.create), controller.create)
router.get('/:id', requireAuth, controller.show)
router.put('/:id', requireAuth, validate(validator.update), controller.update)
router.delete('/:id', requireAuth, controller.destroy)

export default router
