import express from 'express'
import supertest from 'supertest'

const app: express.Application = express()
const HOST_URL = 'http://localhost:5000'

describe('Auth', () => {
  describe('POST /api/auth', () => {
    it('responds with json and success true', () => {
      supertest(HOST_URL)
        .post('/api/auth')
        .set(
          'Authorization',
          'Basic ' + Buffer.from('username:password').toString('base64'),
        )
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })
})
