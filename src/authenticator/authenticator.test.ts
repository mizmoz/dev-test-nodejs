import { Context } from 'koa'
import authenticator, { KoaError } from './authenticator'
import auth from './authenticate'

jest.mock('./authenticate')
const authService = auth as jest.Mock

describe('authenticator', () => {
  beforeEach(() => {
    jest.clearAllMocks
  })

  test('successful authentication', async () => {
    authService.mockResolvedValue(true)
    const ctx = {
      headers: {
        authorization: `Basic ${Buffer.from('user:pwd').toString('base64')}`,
      },
    } as Context

    const next = jest.fn()

    await authenticator(ctx, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(authService).toHaveBeenCalledWith('user', 'pwd')
  })

  test('unsuccessful authentication', async () => {
    authService.mockResolvedValue(false)
    let error: KoaError

    const ctx = {
      headers: {
        authorization: `Basic ${Buffer.from('user:pwd').toString('base64')}`,
      },
    } as Context

    await authenticator(ctx, Promise.resolve).catch(e => (error = e))

    // @ts-expect-error
    expect(error.message).toBe('Not Authenticated')
    // @ts-expect-error
    expect(error.statusCode).toBe(401)
  })
})
