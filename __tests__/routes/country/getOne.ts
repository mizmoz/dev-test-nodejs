import { CountryModel } from "./../../../src/models/country";
import { Country } from "./../../../src/types";
import * as http from 'http';
import fetch from 'node-fetch';
import redis, { RedisClient } from 'redis-mock';
import GetCountryRoute from "../../../src/routes/country/getOne";

describe('src/routes/country/list.ts', () => {

  let countryModel : CountryModel;

  let server: http.Server;

  let countryModelSpy : jest.SpyInstance;
  
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

    countryModelSpy = jest.spyOn(countryModel, 'getOne');

    server = http.createServer((request, response) => {
      const Route = new GetCountryRoute({
        request,
        response
      }, {
        models: {
          country: countryModel
        }
      });

      Route.setUpRoutes();
    });

    server.listen(4444);
  });

  afterEach(() => {
    server.close();
  });

  describe('/countries/:code', () => {
    test('should return country', function(done) {
      fetch('http://0.0.0.0:4444/countries/a', {
        method : 'GET'
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelSpy).toHaveBeenCalledTimes(1);
        expect(countryModelSpy).toBeCalledWith('a');
        expect(json).toEqual({
          country : {
            name : 'CountryA',
            code : 'a'
          }
        })
        done();
      })
    })

    test('should return empty object if country is not found', function(done){
      fetch('http://0.0.0.0:4444/countries/c', {
        method : 'GET'
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelSpy).toHaveBeenCalledTimes(1);
        expect(countryModelSpy).toBeCalledWith('c');
        expect(json).toEqual({});
        done();
      })
    });
  });
});