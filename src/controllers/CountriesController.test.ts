import { Container } from "typedi";
import request from "supertest";

import { AuthService } from "../services/AuthService";
import { CountriesService } from "../services/CountriesService";
import { RedisService } from "../services/RedisService";
import { initializeApp, AppContainer } from "../app";
import { initializeRedis } from "../redis";

let accessToken = "";

beforeAll(async () => {
  initializeApp();
  const results = await Promise.all([
    Container.get(AuthService).signToken({
      username: "username",
    }),
    initializeRedis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379"),
  ]);
  accessToken = results[0];
  Container.get(RedisService).client.flushall();

  const countries = Container.get(CountriesService);
  await Promise.all([
    countries.createCountry({
      code: "gbr",
      name: "United Kingdom",
      population: 66650000,
    }),
    countries.createCountry({
      code: "usa",
      name: "United States",
      population: 328200000,
    }),
    countries.createCountry({
      code: "can",
      name: "Canada",
      population: 37590000,
    }),
  ]);
});

afterAll(done => {
  Container.get(RedisService).client.flushall();
  Container.get(RedisService).client.quit(done);
});

describe.each<["get" | "post" | "put" | "patch" | "delete", string]>([
  ["get", "/countries"],
  ["post", "/countries"],
  ["put", "/countries/gbr"],
  ["patch", "/countries/gbr"],
  ["delete", "/countries/gbr"],
])("%s %s Test Suite - basic route and auth checks", (method, route) => {
  test("route exists", done => {
    const requestFn = request(Container.get(AppContainer).app)[method];
    requestFn(route)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/, done);
  });

  test("requires an authorization header", done => {
    const requestFn = request(Container.get(AppContainer).app)[method];
    requestFn(route)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, done);
  });

  test(`responds with an error with an invalid access token`, done => {
    const requestFn = request(Container.get(AppContainer).app)[method];
    requestFn(route)
      .set("Authorization", `Bearer wrongtoken`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, done);
  });

  test(`responds with an error with an invalid verified access token`, async done => {
    const requestFn = request(Container.get(AppContainer).app)[method];
    const invalidToken = await Container.get(AuthService).signToken({
      banned: true,
    });

    requestFn(route)
      .set("Authorization", `Bearer ${invalidToken}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401, done);
  });

  test("requires a valid access token", done => {
    request(Container.get(AppContainer).app)
      .get("/countries")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("GET /countries Test Suite", () => {
  test("responds with a list of countries sorted by population (no sort query param)", done => {
    request(Container.get(AppContainer).app)
      .get("/countries")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toStrictEqual([
          {
            code: "usa",
            name: "United States",
            population: 328200000,
          },
          {
            code: "gbr",
            name: "United Kingdom",
            population: 66650000,
          },
          {
            code: "can",
            name: "Canada",
            population: 37590000,
          },
        ]);

        done();
      })
      .catch(err => {
        done(err);
      });
  });

  test("responds with a list of countries sorted by population (sort ascending)", done => {
    request(Container.get(AppContainer).app)
      .get("/countries?sort=asc")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toStrictEqual([
          {
            code: "can",
            name: "Canada",
            population: 37590000,
          },
          {
            code: "gbr",
            name: "United Kingdom",
            population: 66650000,
          },
          {
            code: "usa",
            name: "United States",
            population: 328200000,
          },
        ]);

        done();
      })
      .catch(err => {
        done(err);
      });
  });
});

describe("POST /countries Test Suite", () => {
  afterAll(async done => {
    const countries = Container.get(CountriesService);
    await countries.deleteCountry("phi");
    done();
  });

  test("valid input, country added", done => {
    request(Container.get(AppContainer).app)
      .post("/countries")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Accept", "application/json")
      .send({ code: "phi", name: "Philippines", population: 108100000 })
      .expect("Content-Type", /json/)
      .then(async res => {
        expect(res.body).toStrictEqual({
          code: "phi",
          name: "Philippines",
          population: 108100000,
        });

        const country = await new Promise((resolve, reject) => {
          Container.get(RedisService).client.hgetall(
            "country.phi",
            (err, reply) => {
              if (err) {
                reject(err);
              }
              resolve(reply);
            },
          );
        });

        expect(country).toStrictEqual({ name: "Philippines" });

        const population = await new Promise((resolve, reject) => {
          Container.get(RedisService).client.zscore(
            "countriesByPopulation",
            "phi",
            (err, reply) => {
              if (err) {
                reject(err);
              }
              resolve(reply);
            },
          );
        });

        expect(population).toBe("108100000");

        done();
      })
      .catch(err => {
        done(err);
      });
  });
});

describe("PUT|PATCH /countries/:countryCode Test Suite", () => {
  test("valid input, country updated", done => {
    request(Container.get(AppContainer).app)
      .put("/countries/gbr")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Accept", "application/json")
      .send({ name: "Great Britain", population: 66650001 })
      .expect("Content-Type", /json/)
      .then(async () => {
        const country = await new Promise((resolve, reject) => {
          Container.get(RedisService).client.hgetall(
            "country.gbr",
            (err, reply) => {
              if (err) {
                reject(err);
              }
              resolve(reply);
            },
          );
        });

        expect(country).toStrictEqual({ name: "Great Britain" });

        const population = await new Promise((resolve, reject) => {
          Container.get(RedisService).client.zscore(
            "countriesByPopulation",
            "gbr",
            (err, reply) => {
              if (err) {
                reject(err);
              }
              resolve(reply);
            },
          );
        });

        expect(population).toBe("66650001");

        done();
      })
      .catch(err => {
        done(err);
      });
  });
});

describe("DELETE /countries/:countryCode Test Suite", () => {
  test("valid input, country deleted", async done => {
    const countries = Container.get(CountriesService);
    const preResult = await countries.getCountries();
    const country = preResult.find(c => c.code === "usa");

    expect(country).toStrictEqual({
      code: "usa",
      name: "United States",
      population: 328200000,
    });

    request(Container.get(AppContainer).app)
      .delete("/countries/usa")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then(async () => {
        const postResult = await countries.getCountries();
        const index = postResult.findIndex(c => c.code === "usa");

        expect(index).toBe(-1);
        done();
      })
      .catch(err => {
        done(err);
      });
  });
});
