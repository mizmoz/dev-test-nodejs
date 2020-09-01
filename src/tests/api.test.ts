import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index";

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Countries", () => {
  describe("GET /api/country/", () => {
    it("should get all countires", async done => {
      let resp = await chai
        .request(server)
        .get("/api/country/")
        .auth("username", "password");
      expect(resp).to.have.status(200);
      resp.body.should.be.a("object");
      done();
    });
  });

  describe("GET /api/country/:code - path", () => {
    it("should get specific country - Philippines", async done => {
      const code = "phi";
      let resp = await chai
        .request(server)
        .get(`/api/country/${code}`)
        .auth("username", "password");
      expect(resp).to.have.status(200);
      expect(resp.body.code).to.be.equal("phi");
      expect(resp.body.name).to.be.equal("PHILIPPINES");
      done();
    });
  });

  describe("GET /api/country?code=<code> - query", () => {
    it("should get specific country - Philippines", async done => {
      const code = "phi";
      let resp = await chai
        .request(server)
        .get(`/api/country?code=${code}`)
        .auth("username", "password");
      expect(resp).to.have.status(200);
      expect(resp.body.code).to.be.equal("phi");
      expect(resp.body.name).to.be.equal("PHILIPPINES");
      done();
    });
  });

  describe("GET /api/country?name=<name> - query", () => {
    it("should get specific country - Philippines", async done => {
      const code = "philippines";
      let resp = await chai
        .request(server)
        .get(`/api/country?code=${code}`)
        .auth("username", "password");
      expect(resp).to.have.status(200);
      expect(resp.body.code).to.be.equal("phi");
      expect(resp.body.name).to.be.equal("PHILIPPINES");
      done();
    });
  });

  describe("PUT /api/country/:code - path", () => {
    it("should return message succes", async done => {
      const code = "phi";

      const param = {
        population: 100000,
        name: "PHILIPPINES",
        code: "phi",
      };
      let resp = await chai
        .request(server)
        .put(`/api/country/${code}`)
        .send(param)
        .auth("username", "password");
      expect(resp).to.have.status(200);
      resp.body.should.be.a("object");
      expect(resp.body.message).to.be.equal("success");
      done();
    });

    it("PHILIPPINES population should be updated", async done => {
      const code = "phi";
      const param = {
        population: 100000,
      };
      let resp = await chai
        .request(server)
        .get(`/api/country/${code}`)
        .auth("username", "password");
      expect(resp).to.have.status(200);
      expect(resp.body.code).to.be.equal("phi");
      expect(resp.body.name).to.be.equal("PHILIPPINES");
      expect(resp.body.population).to.be.equal(param.population);
      done();
    });
  });

  describe("DELETE /api/country/:code - path", () => {
    it("should return message succes", async done => {
      const code = "phi";
      let resp = await chai
        .request(server)
        .del(`/api/country/${code}`)
        .auth("username", "password");
      expect(resp).to.have.status(200);
      resp.body.should.be.a("object");
      expect(resp.body.message).to.be.equal("success");
      done();
    });

    it("phi should be deleted", async done => {
      const code = "phi";
      let resp = await chai
        .request(server)
        .get(`/api/country/${code}`)
        .auth("username", "password");
      expect(resp.body.message).to.be.equal("No available country");

      let resp1 = await chai
        .request(server)
        .get(`/api/country`)
        .send({
          code: "phi",
          name: "PHILIPPINES",
        })
        .auth("username", "password");
      done();
    });
  });
});
