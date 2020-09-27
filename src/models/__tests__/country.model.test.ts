import {
  Callback as RedisCallback
} from "redis";

import countryConfig from "../../configs/country";
import {SortOrder} from "../../types";
import {Country, SortableFields} from "../country.model";

function mockCountryRedisResult() {
  const mockCountryMap: { [index:string]: string } = {};

  countryConfig.forEach(country => {
    mockCountryMap[country.code] = JSON.stringify(country);
  });

  return mockCountryMap;
}

describe("src/models/country.model.ts", () => {
  let redis: any;
  let mockHmset: jest.Mock;
  let mockHgetall: jest.Mock;
  let mockCountries: object;
  let countryModel: Country;

  beforeAll(() => {
    mockCountries = mockCountryRedisResult();
  });

  beforeEach(() => {
    // Mock redis methods
    mockHmset = jest.fn((key: string, ...args: Array<string | RedisCallback<string>>) => {
      const callback = args[args.length - 1] as RedisCallback<string>;
      callback(null, "OK");
    });

    mockHgetall = jest.fn((key: string, callback: RedisCallback<object>) => {
      callback(null, mockCountries);
    });

    redis = jest.genMockFromModule("redis");
    redis.createClient = () => ({
      hmset: mockHmset,
      hgetall: mockHgetall
    });

    countryModel = new Country({ redisClient: redis.createClient() });
  });

  afterEach(() => {
    mockHmset.mockRestore();
    mockHgetall.mockRestore();
  });

  describe("#constructor", () => {
    test("instantiate a country model", () => {
      expect(countryModel).toHaveProperty("redisClient");
    });
  });

  describe("#setCountry", () => {
    test("set country in redis hash set", async () => {
      const setCountryReply = await countryModel.setCountry("AFGHANISTAN", "afg", 300);
      expect(setCountryReply).toBe("OK");
    });

    test("error", async () => {
      mockHmset.mockImplementationOnce((key: string, ...args: Array<string | RedisCallback<string>>) => {
        const callback = args[args.length - 1] as RedisCallback<string>;
        callback(new Error("test error"), "");
      });

      try {
        await countryModel.setCountry("test", "test", 0);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("#getCountries", () => {
    test("get all countries from list", async () => {
      const countries = await countryModel.getCountries();
      expect(countries.length).toEqual(Object.keys(mockCountries).length);
    });

    test("get countries sorted by population in ascending order", async () => {
      const countries = await countryModel.getCountries();

      // Sort countries manually to compare with method sort
      const mockSortedCountries = countries.sort((a, b) => a.population - b.population);

      const sortedCountries = await countryModel.getCountries({
        sort: SortableFields.POPULATION,
        sortOrder: SortOrder.ASCENDING
      });

      expect(sortedCountries).toEqual(mockSortedCountries);
    });

    test("get countries sorted by population in descending order", async () => {
      const countries = await countryModel.getCountries();

      // Sort countries manually to compare with method sort
      const mockSortedCountries = countries.sort((a, b) => b.population - a.population);

      const sortedCountries = await countryModel.getCountries({
        sort: SortableFields.POPULATION,
        sortOrder: SortOrder.DESCENDING
      });

      expect(sortedCountries).toEqual(mockSortedCountries);
    });
  });
});
