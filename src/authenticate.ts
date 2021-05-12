import { Context, Next } from 'koa'

import authenticate from './services/authenticate'

export interface KoaError extends Error {
  statusCode?: number
}

export default async (ctx: Context, next: Next) => {
  let authenticated = false
  const authHeader = ctx.headers.authorization
  if (authHeader) {
    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString()
      .split(':')
    authenticated = await authenticate(username, password)
  }

  if (!authenticated) {
    const error: KoaError = new Error('Not Authenticated')
    error.statusCode = 401

    throw error
  }

  await next()
}
