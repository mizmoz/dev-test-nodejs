import { CountryModel } from "./../../../src/models/country";
import { Country } from "./../../../src/types";
import * as http from 'http';
import fetch from 'node-fetch';
import redis, { RedisClient } from 'redis-mock';
import UpdateCountryPopulationRoute from "../../../src/routes/country/population";

describe('src/routes/country/list.ts', () => {

  let countryModel : CountryModel;

  let server: http.Server;

  let countryModelUpdateSpy : jest.SpyInstance;
  let countryModelGetOneSpy : jest.SpyInstance;
  
  beforeEach( () => {
    const mockCountries : Country[] = [{
      name : 'CountryA',
      code : 'a'
    }, {
      name : 'CountryB',
      code : 'b'
    }];
    
    const redisClient : RedisClient = redis.createClient();
    countryModel = new CountryModel(redisClient, mockCountries);

    countryModelUpdateSpy = jest.spyOn(countryModel, 'updatePopulation');
    countryModelGetOneSpy = jest.spyOn(countryModel, 'getOne');

    server = http.createServer((request, response) => {
      const Route = new UpdateCountryPopulationRoute({
        request,
        response
      }, {
        models: {
          country: countryModel
        }
      });

      Route.setUpRoutes();
    });

    server.listen(4443);
  });

  afterEach(() => {
    server.close();
  });

  describe('/countries/:code/population', () => {
    test('should return updated country', function(done) {
      fetch('http://0.0.0.0:4443/countries/a/population', {
        method : 'PUT',
        body : JSON.stringify({
          population : 10
        })
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelGetOneSpy).toHaveBeenCalledTimes(1);
        expect(countryModelGetOneSpy).toBeCalledWith('a');

        expect(countryModelUpdateSpy).toHaveBeenCalledTimes(1);
        expect(countryModelUpdateSpy).toBeCalledWith('a', { population : 10 });
        
        expect(json).toEqual({
          country : {
            name : 'CountryA',
            code : 'a',
            population : 10
          }
        })
        done();
      })
    });

    test('should return empty if not found', function(done) {
      fetch('http://0.0.0.0:4443/countries/d/population', {
        method : 'PUT',
        body : JSON.stringify({
          population : 5
        })
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelGetOneSpy).toHaveBeenCalledTimes(1);
        expect(countryModelGetOneSpy).toBeCalledWith('d');

        expect(json).toEqual({});
        done();
      })
    });
  });
});