import { CountryModel } from "./../../../src/models/country";
import { Country } from "./../../../src/types";
import * as http from 'http';
import fetch from 'node-fetch';
import UpdateCountryRoute from "../../../src/routes/country/update";

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
    
    countryModel = new CountryModel(mockCountries);

    countryModelUpdateSpy = jest.spyOn(countryModel, 'updateOne');
    countryModelGetOneSpy = jest.spyOn(countryModel, 'getOne');

    server = http.createServer((request, response) => {
      const Route = new UpdateCountryRoute({
        request,
        response
      }, {
        models: {
          country: countryModel
        }
      });

      Route.setUpRoutes();
    });

    server.listen(4441);
  });

  afterEach(() => {
    server.close();
  });

  describe('/countries/:code', () => {
    test('should return updated country', function(done) {
      fetch('http://0.0.0.0:4441/countries', {
        method : 'PUT',
        body : JSON.stringify({
          code : 'a',
          name : 'CountryC'
        })
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelGetOneSpy).toHaveBeenCalledTimes(1);
        expect(countryModelGetOneSpy).toBeCalledWith('a');

        expect(countryModelUpdateSpy).toHaveBeenCalledTimes(1);
        expect(countryModelUpdateSpy).toBeCalledWith('a', { name : 'CountryC' });
        
        expect(json).toEqual({
          country : {
            name : 'CountryC',
            code : 'a'
          }
        })
        done();
      })
    });

    test('should return empty if not found', function(done) {
      fetch('http://0.0.0.0:4441/countries', {
        method : 'PUT',
        body : JSON.stringify({
          code : 'd',
          name : 'CountryC'
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