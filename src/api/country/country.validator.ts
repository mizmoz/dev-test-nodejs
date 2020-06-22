import { Joi } from 'express-validation'

const create = {
  body: Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
  }),
}

const update = {
  body: Joi.object({
    name: Joi.string(),
    code: Joi.string(),
  }),
}

export default {
  create,
  update,
}
