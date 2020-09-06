import { Country, QueryParams } from "../types";
import { hGetAll, redisClient, zRange, zRevRange } from './redis-client';


const CountriesOrderedSet = 'countries_by_population';
function countryHashKey(code: string): string {
  return `country:${code}`;
}



/**
 * API to get the countries
 *
 */
export async function all(params: QueryParams): Promise< Array<Partial<Country>> > {
  let rangeMethod = zRange;

  if (params.sort && params.sort === 'population|desc') {
    rangeMethod = zRevRange;
  }

  const sortedCodes = await rangeMethod(CountriesOrderedSet, 0 , -1) as any;
  const countries: Array<Partial<Country>> = [];
  let countryItem: Partial<Country>;

  for (const c of sortedCodes) {
    countryItem = await hGetAll(`country:${c}`);
    countries.push(countryItem);
  }

  return countries;
}

export async function get(code: string): Promise<Partial<Country> | null> {
  return hGetAll(`country:${code}`) as Partial<Country>;
}

export function update(code: string, country: Country): Promise<Country> {

  // forced to use this due to inconsistent redis type defs
  return new Promise((resolve, reject) => {
    redisClient.hmset(countryHashKey(code), 'code', country.code, 'population', country.population, 'name', country.name,
      (err, res) => {
        if(err) {
          reject(err);
        }

        redisClient.zadd(CountriesOrderedSet, country.population, code, (err2, res2) => {

          if(err) {
            reject(err);
          }

          resolve(country);

        });
      }
    );
  })

}



export async function remove(code: string): Promise<Partial<Country> | null> {

  const country = await hGetAll(countryHashKey(code)) as Partial<Country>;

  if (!country) {
    return null;
  }

  // forced to use this due to inconsistent redis type defs
  return new Promise((resolve, reject) => {
    redisClient.del(countryHashKey(code),
      (err, res) => {
        if (err) {
          reject(err);
        }

        redisClient.zrem(CountriesOrderedSet, code, (err2, res2) => {

          if (err2) {
            reject(err);
          }

          resolve(country);

        });
      }
    );
  })

}
