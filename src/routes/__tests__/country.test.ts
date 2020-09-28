import {Express} from "express";
import {Server} from "http";
import request from "supertest";

import CountryAPI from "../../api/country";
import createApp from "../../app";
import {ICountry, SortableFields} from "../../models/country.model";
import createServer from "../../server";
import {SortOrder} from "../../types";

jest.mock("../../api/country");

describe("src/routes/country.ts", () => {
  let server: Server;
  let app: Express;
  let mockCountries: ICountry[];

  beforeAll(() => {
    CountryAPI.prototype.list = jest.fn().mockResolvedValue([]);
    CountryAPI.prototype.sortedList = jest.fn().mockResolvedValue([]);

    mockCountries = [
      {
        name: "Uruguay",
        code: "urg",
        population: 300
      },
      {
        name: "Philippines",
        code: "ph",
        population: 100
      },
      {
        name: "Singapore",
        code: "sg",
        population: 250
      }
    ];
  });

  beforeEach(() => {
    app = createApp();
    server = createServer(app);
  });

  afterEach(() => {
    server.close();
    (CountryAPI.prototype.list as jest.Mock).mockRestore();
    (CountryAPI.prototype.sortedList as jest.Mock).mockRestore();
  });

  describe("GET /country", () => {
    test("success", async () => {
      const response = await request(server).get("/country");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test("sort by population in ascending order", async () => {
      const expectedResult = mockCountries.sort((a, b) => a.population - b.population);
      (CountryAPI.prototype.sortedList as jest.Mock).mockResolvedValueOnce(expectedResult);

      const response = await request(server)
        .get("/country")
        .query({ 
          sort: SortableFields.POPULATION,
          sortOrder: SortOrder.ASCENDING
        });

      expect(response.body).toEqual(expectedResult);
    });

    test("sort by population in descending order", async () => {
      const expectedResult = mockCountries.sort((a, b) => b.population - a.population);
      (CountryAPI.prototype.sortedList as jest.Mock).mockResolvedValueOnce(expectedResult);

      const response = await request(server)
        .get("/country")
        .query({ 
          sort: SortableFields.POPULATION,
          sortOrder: SortOrder.DESCENDING
        });

      expect(response.body).toEqual(expectedResult);
    });

    test("error", async () => {
      try {
        await request(server).get("/country");
      } catch (error) {
        expect(error.status).toBe(500);
        expect(error).toBeDefined();
      }
    });
  });

});
