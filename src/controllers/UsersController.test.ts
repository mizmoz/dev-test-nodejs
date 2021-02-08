import { Container } from "typedi";
import request from "supertest";
import jwt from "jsonwebtoken";

import { initializeApp, AppContainer } from "../app";

beforeAll(() => {
  initializeApp();
});

describe("POST /users/login Test Suite", () => {
  test("route exists", done => {
    request(Container.get(AppContainer).app)
      .post("/users/login")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/, done);
  });

  test("requires a username", done => {
    request(Container.get(AppContainer).app)
      .post("/users/login")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .then(res => {
        const usernameError = res.body.errors.find(
          ({ property }: any) => property === "username",
        );
        expect(usernameError.constraints.isString).toBe(
          "username must be a string",
        );
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  test("requires a password", done => {
    request(Container.get(AppContainer).app)
      .post("/users/login")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .then(res => {
        const passwordError = res.body.errors.find(
          ({ property }: any) => property === "password",
        );
        expect(passwordError.constraints.isString).toBe(
          "password must be a string",
        );
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  test("requires string username, password", done => {
    request(Container.get(AppContainer).app)
      .post("/users/login")
      .send({ username: 111, password: 222 })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .then(res => {
        const usernameError = res.body.errors.find(
          ({ property }: any) => property === "username",
        );
        expect(usernameError.constraints.isString).toBe(
          "username must be a string",
        );

        const passwordError = res.body.errors.find(
          ({ property }: any) => property === "password",
        );
        expect(passwordError.constraints.isString).toBe(
          "password must be a string",
        );

        done();
      })
      .catch(err => {
        done(err);
      });
  });

  test("responds with error if sent invalid credentials", done => {
    request(Container.get(AppContainer).app)
      .post("/users/login")
      .send({ username: "wronguser", password: "wrongpass" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .then(res => {
        expect(res.body.message).toBe("Invalid username/password.");
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  test("responds with valid access token if sent valid credentials", done => {
    request(Container.get(AppContainer).app)
      .post("/users/login")
      .send({ username: "username", password: "password" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        const decoded: any = jwt.decode(res.body.accessToken);
        expect(decoded?.username).toBe("username");
        done();
      })
      .catch(err => {
        done(err);
      });
  });
});
