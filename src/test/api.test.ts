import request from 'supertest'

import authenticate_ from '../authenticator/authenticate'
import { seed } from './seed/seed'

import { getApp } from '../app'

jest.mock('../authenticator/authenticate')
const authenticate = authenticate_ as jest.Mock

describe('API', () => {
  let url
  let server: unknown

  beforeAll(async () => {
    const app = await getApp()
    server = app.listen(3001)
  })

  beforeEach(async () => {
    jest.resetAllMocks()
  })

  describe('GET /countries', () => {
    beforeEach(async () => {
      await seed([
        { id: '1', population: 65, name: 'UK', code: 'gbr' },
        { id: '2', population: 10, name: 'Austria', code: 'aut' },
      ])
    })

    test('401', async () => {
      const response = await request(server)
        .get('/countries')
        .set('Accept', 'application/json')
        .expect(401)

      expect(response.status).toBe(401)
    })

    test('getting countries', async () => {
      authenticate.mockResolvedValue(true)

      const response = await request(server)
        .get('/countries')
        .set('Accept', 'application/json')
        .set('Authorization', 'Basic dTogcA==')
        .expect(200)

      expect(response.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "gbr",
            "id": "1",
            "name": "UK",
            "population": "65",
          },
          Object {
            "code": "aut",
            "id": "2",
            "name": "Austria",
            "population": "10",
          },
        ]
      `)
    })

    test('getting countries sorted by population (asc)', async () => {
      authenticate.mockResolvedValue(true)

      const response = await request(server)
        .get('/countries?sortBy=population')
        .set('Accept', 'application/json')
        .set('Authorization', 'Basic dTogcA==')
        .expect(200)

      expect(response.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "aut",
            "id": "2",
            "name": "Austria",
            "population": "10",
          },
          Object {
            "code": "gbr",
            "id": "1",
            "name": "UK",
            "population": "65",
          },
        ]
      `)
    })
  })

  describe('POST /countries', () => {
    beforeEach(async () => {
      await seed([])
    })

    test('401', async () => {
      const response = await request(server)
        .post('/countries')
        .set('Accept', 'application/json')
        .send({ name: 'USA', population: 330, code: 'usa' })
        .expect(401)

      expect(response.status).toBe(401)
    })

    test('adding a new country', async () => {
      authenticate.mockResolvedValue(true)

      const response = await request(server)
        .post('/countries')
        .set('Accept', 'application/json')
        .set('Authorization', 'Basic dTogcA==')
        .send({ name: 'USA', population: 330, code: 'usa' })
        .expect(201)

      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "code": "usa",
          "id": "id-usa",
          "name": "USA",
          "population": 330,
        }
      `)

      const getResponse = await request(server)
        .get('/countries')
        .set('Accept', 'application/json')
        .set('Authorization', 'Basic dTogcA==')
        .expect(200)

      expect(getResponse.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "usa",
            "id": "id-usa",
            "name": "USA",
            "population": "330",
          },
        ]
      `)
    })
  })

  describe('PATCH /countries/:id', () => {
    beforeEach(async () => {
      await seed([{ id: '1', population: 65, name: 'UK', code: 'gbr' }])
    })

    test('401', async () => {
      const response = await request(server)
        .patch('/countries/1')
        .set('Accept', 'application/json')
        .send({ name: 'NEW NAME', population: 1111, code: 'NEW' })
        .expect(401)

      expect(response.status).toBe(401)
    })

    test('updating an existing country', async () => {
      authenticate.mockResolvedValue(true)

      const response = await request(server)
        .patch('/countries/1')
        .set('Authorization', 'Basic dTogcA==')
        .set('Accept', 'application/json')
        .send({ name: 'NEW NAME', population: 1111, code: 'NEW' })
        .expect(200)

      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "code": "NEW",
          "id": "1",
          "name": "NEW NAME",
          "population": "1111",
        }
      `)

      const getResponse = await request(server)
        .get('/countries')
        .set('Accept', 'application/json')
        .set('Authorization', 'Basic dTogcA==')
        .expect(200)

      expect(getResponse.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "NEW",
            "id": "1",
            "name": "NEW NAME",
            "population": "1111",
          },
        ]
      `)
    })
  })

  describe('DELETE /countries/:id', () => {
    beforeEach(async () => {
      await seed([
        { id: '1', population: 65, name: 'UK', code: 'gbr' },
        { id: '2', population: 10, name: 'Austria', code: 'aut' },
      ])
    })

    test('401', async () => {
      const response = await request(server)
        .delete('/countries/1')
        .set('Accept', 'application/json')
        .expect(401)

      expect(response.status).toBe(401)
    })

    test('deleting an existing country', async () => {
      authenticate.mockResolvedValue(true)

      const response = await request(server)
        .delete('/countries/1')
        .set('Authorization', 'Basic dTogcA==')
        .set('Accept', 'application/json')
        .expect(204)

      expect(response.body).toMatchInlineSnapshot(`Object {}`)

      const getResponse = await request(server)
        .get('/countries')
        .set('Accept', 'application/json')
        .set('Authorization', 'Basic dTogcA==')
        .expect(200)

      expect(getResponse.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "aut",
            "id": "2",
            "name": "Austria",
            "population": "10",
          },
        ]
      `)
    })
  })
})
