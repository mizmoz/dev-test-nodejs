import supertest from 'supertest';

import Service from '../src/service';

describe('Authenticate API', () => {
  let request = supertest(Service);

  describe('POST /authenticate/login', () => {
    it('Should return success', async () => {
      const response = await request.post('/authenticate/login');

      expect(response.status).toBe(200);
    });
  });

  describe('POST /authenticate/register', () => {
    it('Should return success', async () => {
      const response = await request.post('/authenticate/register');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /authenticate/me', () => {
    it('Should return success', async () => {
      const response = await request.get('/authenticate/me');

      expect(response.status).toBe(200);
    });
  })
});
