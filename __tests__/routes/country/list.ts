import { CountryModel } from "./../../../src/models/country";
import { Country } from "./../../../src/types";
import * as http from 'http';
import ListCountriesRoute from "../../../src/routes/country/list";
import fetch from 'node-fetch';

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
    
    countryModel = new CountryModel(mockCountries);

    countryModelSpy = jest.spyOn(countryModel, 'listAll');

    server = http.createServer((request, response) => {
      const Route = new ListCountriesRoute({
        request,
        response
      }, {
        models: {
          country: countryModel
        }
      });

      Route.setUpRoutes();
    });

    server.listen(4445);
  });

  afterEach(() => {
    server.close();
  });

  describe('/countries', () => {

    beforeEach(() => {
      jest
        .spyOn(Math, 'random')
        .mockImplementationOnce(() => 0)
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should return all countries', function(done) {
      fetch('http://0.0.0.0:4445/countries', {
        method : 'GET'
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelSpy).toHaveBeenCalledTimes(1);
        expect(countryModelSpy).toHaveBeenCalledWith(true); // mock reject false
        expect(json).toEqual({
          countries : [{
            name : 'CountryA',
            code : 'a'
          }, {
            name : 'CountryB',
            code : 'b'
          }]
        })
        done();
      })
    })
  });

  describe('/countries', () => {

    beforeEach(() => {
      jest
        .spyOn(Math, 'random')
        .mockImplementationOnce(() => 1)
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should return all countries', function(done) {
      fetch('http://0.0.0.0:4445/countries', {
        method : 'GET'
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelSpy).toHaveBeenCalledTimes(1);
        expect(countryModelSpy).toHaveBeenCalledWith(false); // mock reject
        expect(json).toEqual({
          countries : []
        })
        done();
      })
    })
  });
});