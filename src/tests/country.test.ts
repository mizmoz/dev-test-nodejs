import supertest from 'supertest'

const HOST_URL = 'http://localhost:8000'

describe('Countries', () => {
  describe('GET /api/countries', () => {
    it('responds with json and success true', () => {
      supertest(HOST_URL)
        .get('/api/countries')
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })

  describe('GET /api/countries/{code} - usa', () => {
    it('responds with json and success true', () => {
      supertest(HOST_URL)
        .get('/api/countries/usa')
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })

  describe('UPDATE /api/countries/{code} - aus', () => {
    it('responds with json and success true', () => {
      const payload = {
        code: 'any',
        name: 'test country',
        population: 12345,
      }

      supertest(HOST_URL)
        .put('/api/countries/aus')
        .send(payload)
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })

  describe('DELETE /api/countries/{code} - yem', () => {
    it('responds with json and success true', () => {
      supertest(HOST_URL)
        .get('/api/countries/yem')
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('success', true)
        })
    })
  })
})