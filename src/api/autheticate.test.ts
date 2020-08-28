
import authenticate from './authenticate'


describe('authenticate',  () => {
    it('should return true if valid', async() => {
      expect(await authenticate('username', 'password')).toBe(true)
    })

    it('should return false if not valid ', async() => {
      expect(await authenticate('username', 'passwordx')).toBe(false)
    })
  })