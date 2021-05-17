import supertest from 'supertest';
import Server from '../src/index';

describe('Countries API', () => {
  let request = supertest(Server);

  describe('GET /countries', () => {
    it('Should return success', async () => {
      const response = await request.get('/countries?username=api-user&password=Vp9RFY2wQ2cXLyvn');

      expect(response.status).toBe(200);
    });
  });
});
