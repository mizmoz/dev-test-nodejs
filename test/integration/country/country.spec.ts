import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../../src/app';
import redis, { shutdownRedis } from '../../../src/library/redis';
import { Country } from '../../../src/types';
import { seed } from '../../../src/seeders/add-country-data';

describe('Country Operations', () => {
  beforeAll(async () => {
    await seed();
  });
  afterAll(async () => {
    await shutdownRedis();
  });

  describe('GET /country', () => {
    it('should get all countries', async () => {
      const response = (
        await supertest(app)
          .get('/country')
          .auth('username', 'password')
          .set({
            Accept: 'application/json',
          })
          .expect(200)
      ).body as Country[];

      expect(response).to.ok;
      expect(response.length).to.be.greaterThan(0);

      response.forEach(country => {
        expect(country).to.have.all.keys(['code', 'name', 'population']);
      });
    });

    it('should get all countries based on sort', async () => {
      const response = (
        await supertest(app)
          .get('/country?sort=population')
          .auth('username', 'password')
          .set({
            Accept: 'application/json',
          })
          .expect(200)
      ).body as Country[];

      expect(response).to.ok;
      expect(response.length).to.be.greaterThan(0);

      const first = response[0];
      const last = response[response.length - 1];

      expect(first.population).to.be.greaterThan(last.population);

      response.forEach(country => {
        expect(country).to.have.all.keys(['code', 'name', 'population']);
      });
    });
  });

  describe('DELETE /country/:code', () => {
    it('should delete a specific country', async () => {
      const code = 'usa';
      const response = await supertest(app)
        .delete(`/country/${code}`)
        .auth('username', 'password')
        .set({
          Accept: 'application/json',
        })
        .expect(200);

      expect(response.status).to.equal(200);
    });

    it('should throw an error if code is invalid', async () => {
      const code = 'usa1';
      const response = await supertest(app)
        .delete(`/country/${code}`)
        .auth('username', 'password')
        .set({
          Accept: 'application/json',
        });

      expect(response.body).to.have.property('errors', 'Invalid code');
    });
  });

  describe('POST /country', () => {
    it('should update a specific country', async () => {
      const code = 'cam';
      const response = await supertest(app)
        .post(`/country`)
        .send({
          code,
          population: 10,
        })
        .auth('username', 'password')
        .set({
          Accept: 'application/json',
        })
        .expect(200);

      expect(response.status).to.equal(200);

      const updated = (await redis.getAsync(code)) as string;
      const parseData = JSON.parse(updated) as Country;

      expect(parseData).to.have.property('population', 10);
    });

    it('should thrown an error if code is not provided', async () => {
      const response = await supertest(app)
        .post(`/country`)
        .send({
          population: 10,
        })
        .auth('username', 'password')
        .set({
          Accept: 'application/json',
        })
        .expect(400);

      expect(response.body).to.have.property(
        'errors',
        'No code parameter provided.',
      );
    });
  });
});
