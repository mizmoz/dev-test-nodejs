import { CountryModel } from "./../../../src/models/country";
import { Country } from "./../../../src/types";
import * as http from 'http';
import fetch from 'node-fetch';
import DeleteCountryRoute from "../../../src/routes/country/deleteOne";

describe('src/routes/country/list.ts', () => {

  let countryModel : CountryModel;

  let server: http.Server;

  let countryModelGetOneSpy : jest.SpyInstance;
  let countryModelDeleteOneSpy : jest.SpyInstance;
  
  beforeEach( () => {
    const mockCountries : Country[] = [{
      name : 'CountryA',
      code : 'a'
    }, {
      name : 'CountryB',
      code : 'b'
    }];
    
    countryModel = new CountryModel(mockCountries);

    countryModelGetOneSpy = jest.spyOn(countryModel, 'getOne');
    countryModelDeleteOneSpy = jest.spyOn(countryModel, 'getOne');

    server = http.createServer((request, response) => {
      const Route = new DeleteCountryRoute({
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
    test('should return false for successful delete', function(done) {
      fetch('http://0.0.0.0:4444/countries/a', {
        method : 'DELETE'
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelGetOneSpy).toHaveBeenCalledTimes(1);
        expect(countryModelGetOneSpy).toBeCalledWith('a');

        expect(countryModelDeleteOneSpy).toHaveBeenCalledTimes(1);
        expect(countryModelDeleteOneSpy).toBeCalledWith('a');

        expect(json).toEqual({
          ok : true
        })
        done();
      })
    })

    test('should return false for unsuccessful delete', function(done){
      fetch('http://0.0.0.0:4444/countries/c', {
        method : 'DELETE'
      })
      .then(response => response.json())
      .then(json => {
        expect(countryModelGetOneSpy).toHaveBeenCalledTimes(1);
        expect(countryModelGetOneSpy).toBeCalledWith('c');
        expect(json).toEqual({
          ok : false
        });
        done();
      })
    });
  });
});