import { Context } from 'koa'
import authenticate, { KoaError } from './authenticate'
import auth from './services/authenticate'

jest.mock('./services/authenticate')
const authService = auth as jest.Mock

describe('authenticate', () => {
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

    await authenticate(ctx, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(authService).toHaveBeenCalledWith('user', 'pwd')
  })

  test('unsuccessful authentication', async () => {
    authService.mockResolvedValue(false)
    const ctx = {
      headers: {
        authorization: `Basic ${Buffer.from('user:pwd').toString('base64')}`,
      },
    } as Context

    let error: KoaError
    await authenticate(ctx, Promise.resolve).catch(e => (error = e))

    expect(error.message).toBe('Not Authenticated')
    expect(error.statusCode).toBe(401)
  })
})
