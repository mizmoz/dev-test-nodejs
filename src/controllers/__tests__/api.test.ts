import redis from "redis-mock";
import app from "../../index";
import { getMockReq, getMockRes } from "@jest-mock/express";
import * as controllers from '../countriesController'

const { res, next, clearMockRes } = getMockRes();


jest.mock('redis', ()=> redis)

const user = {
  username: "username",
  password: "password",
};

describe("API", () => {
  beforeAll(() => {
    jest.setTimeout(10000);
  });
  beforeEach(async done => {
    clearMockRes();
    // await redisClient.setAsync("countries", JSON.stringify(countries));
    done();
  });
  it("should create new post", async done => {
    const req = getMockReq({ body: {
       ...user,
       code:  'wknd',
       name: "Wakanda"
    }})

    await controllers.getAll(req, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.any(Array),
    )
    done();
  });

  it("should edit post", async done => {
    const req = getMockReq({ body: {
       ...user,
       code:  'wknd',
       name: "WakandaForever"
    }})

    await controllers.edit(req, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({updated: expect.any(Boolean)}),
    )
    done();
  });


  it("should edit post", async done => {
    const req = getMockReq({ body: {
       ...user,
       code:  'wknd',
       name: "WakandaForever"
    }})

    await controllers.remove(req, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({deleted: expect.any(Boolean)}),
    )
    done();
  });
  
});
