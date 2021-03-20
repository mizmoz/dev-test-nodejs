import supertest from 'supertest';

import Service from '../src/service';

describe('Countries API', () => {
  let request = supertest(Service);

  describe('GET /countries', () => {
    it('Should return success', async () => {
      const response = await request.get('/countries');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /countries/:code', () => {
    it('Should return success', async () => {
      const response = await request.get('/countries/NA');

      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /countries/:code', () => {
    it('Should return success', async () => {
      const response = await request.patch('/countries/NA');

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /countries/:code', () => {
    it('Should return success', async () => {
      const response = await request.delete('/countries/NA');

      expect(response.status).toBe(200);
    });
  });
});
