import { CountryModel } from "./../../../src/models/country";
import { Country } from "./../../../src/types";
import * as http from 'http';
import fetch from 'node-fetch';
import redis, { RedisClient } from 'redis-mock';
import SortCountryPopulationRoute from "../../../src/routes/country/sort";

describe('src/routes/country/list.ts', () => {

  let countryModel : CountryModel;

  let server: http.Server;

  let countryModelSpy : jest.SpyInstance;
  
  beforeEach( () => {
    const mockCountries : Country[] = [{
      name : 'CountryA',
      code : 'a',
      population : 10
    }, {
      name : 'CountryB',
      code : 'b',
      population : 9
    }];
    
    const redisClient : RedisClient = redis.createClient();
    countryModel = new CountryModel(redisClient, mockCountries);

    countryModelSpy = jest.spyOn(countryModel, 'sortCountries');

    server = http.createServer((request, response) => {
      const Route = new SortCountryPopulationRoute({
        request,
        response
      }, {
        models: {
          country: countryModel
        }
      });

      Route.setUpRoutes();
    });

    server.listen(4446);
  });

  afterEach(() => {
    server.close();
  });

  describe('/countries/sort/population', () => {
    test('should return all countries sorted ascending', function(done) {
      fetch('http://0.0.0.0:4446/countries/sort/population/ASC', {
        method : 'GET'
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelSpy).toHaveBeenCalledTimes(1);
        
        let current : number = json.countries[0].population;
        json.countries.forEach((country : Country) => {
          expect(country.population).toBeGreaterThanOrEqual(current);
          current = country.population === undefined ? 0 : country.population;
        });

        done();
      })
    })

    test('should return all countries sorted descending', function(done) {
      fetch('http://0.0.0.0:4446/countries/sort/population/DES', {
        method : 'GET'
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelSpy).toHaveBeenCalledTimes(1);
        
        let current : number = json.countries[0].population;
        json.countries.forEach((country : Country) => {
          expect(country.population).toBeLessThanOrEqual(current);
          current = country.population === undefined ? 0 : country.population;
        });

        done();
      })
    })
  });
});