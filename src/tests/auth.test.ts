import supertest from 'supertest'

const HOST_URL = 'http://localhost:8000';

describe('User Authentication - Login', () => {
  describe('POST /api/auth/login', () => {
    it('responds with json and success true', () => {
      const payload = {
        username: 'username',
        password: 'password',
      }

      supertest(HOST_URL)
        .post('/api/auth/login')
        .send(payload)
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })
})