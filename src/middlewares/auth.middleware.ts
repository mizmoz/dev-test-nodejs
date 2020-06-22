import jwt from 'express-jwt'

export default jwt({
  secret: process.env.APP_SECRET || 'eDlXOuzbKUTJ6fJXjjLcPagU6Lg8uAcp',
})
