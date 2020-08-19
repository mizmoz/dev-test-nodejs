import { CountryModel } from "../../src/models/Country";
import { Country } from "../../src/types";

describe('src/models/country', () => {

  let countryModel : CountryModel;
  
  beforeEach( () => {
    const mockCountries : Country[] = [{
      name : 'CountryA',
      code : 'a'
    }, {
      name : 'CountryB',
      code : 'b'
    }];
    
    countryModel = new CountryModel(mockCountries);
  });

  describe('#list', () => {
    test('listAll should return correct values', async() => {
      expect(await countryModel.listAll(false)).toEqual([{
        name : 'CountryA',
        code : 'a'
      }, {
        name : 'CountryB',
        code : 'b'
      }])
    });

    test('listAll should return empty value', async () => {
      try {
        const value = await countryModel.listAll(true);
      } catch (err) {
        expect(err).toEqual([])
      }
    });
  });

  describe('#getOne', () => {
    test('should return { name : CountryA, code : a} is a', () => {
      expect(countryModel.getOne('a')).toEqual({
        name : 'CountryA',
        code : 'a'
      });
    });

    test('should return undefined when code is not found', () => {
      expect(countryModel.getOne('c')).toBeUndefined();
    });
  });

  describe('#updateOne', () => {
    test('should return {name : CountryC, code : a} when code a is updated', () => {
      expect(countryModel.updateOne('a', {name : 'CountryC'})).toEqual({
        name : 'CountryC',
        code : 'a'
      });

      expect(countryModel.getOne('a')).toEqual({
        name : 'CountryC',
        code : 'a'
      });
    })

    test('should return undefined if country is not found', () => {
      expect(countryModel.updateOne('c', {name : 'CountryC'})).toBeUndefined();
    })
  });

  describe('#deleteOne', () => {
    test('should return true if country successfully removed', (done) => {
      expect(countryModel.deleteOne('a')).toBeTruthy();

      expect(countryModel.listAll(false)).toEqual([{
        name : 'CountryB',
        code : 'b'
      }])
      done();
    })

    test('should return false if country is not found', (done) => {
      expect(countryModel.deleteOne('c')).toBeFalsy();

      expect(countryModel.listAll(false)).toEqual([{
        name : 'CountryA',
        code : 'a'
      }, {
        name : 'CountryB',
        code : 'b'
      }])
      done();
    })
  });
});