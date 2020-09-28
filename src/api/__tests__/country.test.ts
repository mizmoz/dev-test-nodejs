import {Country, ICountry} from "../../models/country.model";
import CountryAPI from "../country";

describe("src/api/country.ts", () => {
  let api: CountryAPI;
  let mockCountries: ICountry[];

  beforeEach(() => {
    mockCountries = [
      {
        name: "Country 1",
        code: "c1",
        population: 1
      },
      {
        name: "Country 2",
        code: "c2",
        population: 2
      },
      {
        name: "Country 3",
        code: "c3",
        population: 3
      },
    ];

    Country.prototype.getCountries = jest.fn().mockResolvedValue(mockCountries);
    api = new CountryAPI();

    global.Math.round = jest.fn().mockReturnValue(0);
  });
  
  afterEach(() => {
    (global.Math.round as jest.Mock).mockRestore();
    (Country.prototype.getCountries as jest.Mock).mockRestore();
  });

  describe("#constructor", () => {
    test("create model instance", () => {
      expect(api).toHaveProperty("model");
    });
  });

  describe("#list", () => {
    test("success", async () => {
      expect(await api.list()).toEqual(mockCountries);
    });

    test("error", async () => {
      (global.Math.round as jest.Mock).mockReturnValue(1);

      try {
        await api.list();
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
