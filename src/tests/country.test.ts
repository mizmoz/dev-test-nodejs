import express from 'express'
import supertest from 'supertest'

const app: express.Application = express()
const HOST_URL = 'http://localhost:5000'

describe('Countries', () => {
  describe('GET /api/country', () => {
    it('responds with json and success true', () => {
      supertest(HOST_URL)
        .get('/api/country')
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })

  describe('GET /api/country/{id} - phi', () => {
    it('responds with json and success true', () => {
      supertest(HOST_URL)
        .get('/api/country/phi')
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })

  describe('DELETE /api/country/{id} - ssd', () => {
    it('responds with json and success true', () => {
      supertest(HOST_URL)
        .get('/api/country/ssd')
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })

  describe('UPDATE /api/country/{id} - ssd', () => {
    it('responds with json and success true', () => {
      const apiTest = {
        code: 'any',
        name: 'california, beach, blue',
        population: 123,
      }

      supertest(HOST_URL)
        .put('/api/country/ssd')
        .send(apiTest)
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })
})
