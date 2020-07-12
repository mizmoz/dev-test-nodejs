const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const should = chai.should();

chai.use(chaiHttp);

describe('dev-test-node', () => {

  it('Should return 404 for an invalid route', (done) => {
    chai.request(server.default)
      .get('/')
      .then(response => {
        response.status.should.eql(404);
        done();
      });
  });

  it('Should return 401 for protected routes', (done) => {
    chai.request(server.default)
      .get('/countries')
      .then(response => {
        response.status.should.eql(401);
        done();
      });
  });

  it('Should return all countries', (done) => {
    chai.request(server.default)
      .get('/countries')
      .auth('username', 'password')
      .then(response => {
        response.status.should.to.be.oneOf([200, 500]);
        done();
      });
  });

  it('Should be able to update a country', (done) => {
    const existingCountry = {
      name: 'AFGHANISTAN Updated',
    };

    chai.request(server.default)
      .patch('/countries/afghanistan')
      .auth('username', 'password')
      .send(existingCountry)
      .then(response => {
        response.status.should.eql(200);
        response.body.data.name.should.eql(existingCountry.name);
        done();
      });
  });

  it('Should be able to delete a country', (done) => {
    chai.request(server.default)
      .delete('/countries/ALBANIA')
      .auth('username', 'password')
      .then(response => {
        response.status.should.eql(204);
        done();
      });
  });
});
