import { CountryModel } from "../../src/models/Country";
import { Country } from "../../src/types";
import redis, { RedisClient } from 'redis-mock';

describe('src/models/country', () => {

  let countryModel : CountryModel;
  let redisSetSpy : jest.SpyInstance;
  
  beforeEach( async () => {
    const mockCountries : Country[] = [{
      name : 'CountryA',
      code : 'a'
    }, {
      name : 'CountryB',
      code : 'b'
    }];
  
    const redisClient : RedisClient = redis.createClient();
    redisSetSpy = jest.spyOn(redisClient, 'set');
    countryModel = new CountryModel(redisClient, mockCountries);
  });

  describe('#list', () => {
    test('listAll should return correct values', async() => {
      expect(await countryModel.listAll(true)).toEqual([{
        name : 'CountryA',
        code : 'a'
      }, {
        name : 'CountryB',
        code : 'b'
      }])
    });

    test('listAll should return empty value', async () => {
      try {
        const value = await countryModel.listAll(false);
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

      expect(redisSetSpy).toBeCalledTimes(1);
    })

    test('should return undefined if country is not found', () => {
      expect(countryModel.updateOne('c', {name : 'CountryC'})).toBeUndefined();
      expect(redisSetSpy).toBeCalledTimes(0);
    })
  });

  describe('#deleteOne', () => {
    test('should return true if country successfully removed', (done) => {
      expect(countryModel.deleteOne('a')).toBeTruthy();
      expect(redisSetSpy).toBeCalledTimes(1);

      countryModel.listAll(true).then(countries => {
        expect(countries).toEqual([{
          name : 'CountryB',
          code : 'b'
        }])
        done();
      });
    })

    test('should return false if country is not found', (done) => {
      expect(countryModel.deleteOne('c')).toBeFalsy();
      expect(redisSetSpy).toBeCalledTimes(0);

      countryModel.listAll(true).then(countries => {
        expect(countries).toEqual([{
          name : 'CountryA',
          code : 'a'
        }, {
          name : 'CountryB',
          code : 'b'
        }])
        done();
      });
    })
  });

  describe('#updatePopulation', () => {
    test('should return correct country population', (done) => {
      const updatedCountry = countryModel.updatePopulation('a', {
        population : 10
      });

      // @ts-ignore
      expect(updatedCountry.population).toEqual(10);
      expect(redisSetSpy).toBeCalledTimes(1);

      countryModel.listAll(true).then(countries => {
        expect(countries).toEqual([{
          name : 'CountryA',
          code : 'a',
          population : 10
        }, {
          name : 'CountryB',
          code : 'b'
        }]);
        done();
      });
    })
  })
});