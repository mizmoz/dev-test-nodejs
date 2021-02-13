import redis, { ClientOpts } from "redis";
import { promisify } from "util";
import { Country } from "../types";
import countries from "./country";


declare module "util" {
  function promisify<T, U, R>(fn: redis.OverloadedCommand<T, U, R>): {
      (arg1: T, arg2: T | T[]): Promise<U>;
      (arg1: T | T[]): Promise<U>;
      (...args: Array<T>): Promise<U>;
  };
}

const client = redis.createClient(<ClientOpts>process.env.REDIS_URL);

interface countryI {
  population: number;
  name: string;
  code: string;
}

const setRedis = async (allCountries:Country[]) => {
  try {
    const setAsync = promisify(client.set).bind(client);
    allCountries.map(async country => {
      const value = country;
      const key = country.code;
      await setAsync(key, JSON.stringify(value));
    });
    return allCountries.sort((a: any, b: any) =>
      a.population > b.population ? 1 : -1
    );
  } catch (e) {
    throw new Error(e);
  }
};

const getdata = async (client: any, keys: any) => {
  return new Promise((resolve, reject) => {
    client.mget(keys, (err: any, object: Array<string>) => {
      if (err) {
        reject(err);
      } else {
        const countries: Array<countryI> = object.map(
          (data: string): countryI => JSON.parse(data),
        );
        resolve(countries);
      }
    });
  });
};

const getFromRedis = async () => {
  const getKeys = promisify(client.keys).bind(client);
  const keys = await getKeys("*");
  return keys;
};

const sortCountries = async (keys: Array<string>) => {
  const data: any = await getdata(client, keys);
  return data.sort((a: any, b: any) => (a.population > b.population ? 1 : -1));
};

export const getAllCountries = async () => {
  const allCountries:Array<Country> = await countries();
  try {
    const keys = await getFromRedis();
    if (keys.length > 0) {
      return await sortCountries(keys);
    } else {
      return await setRedis(allCountries);
    }
  } catch (e) {
    console.error(e);
  }
};

export const getCountry = async (key: string) => {
    const data = promisify(client.get).bind(client);
    const c = await data(key);
    const keys = await getFromRedis();
    console.log(c);
    if (keys.length === 0) {
      console.log("no cache");
      const allCountries:Array<Country> = await countries();
      await setRedis(allCountries);
      return allCountries.find(data => data.code === key);
    } else {
      console.log("with cache");
      return JSON.parse(<string>c);
    }
};

export const updateCountry = async(newData:Country)=>{
        client.del(newData.code)
        client.set(newData.code, JSON.stringify(newData))
        console.log(`successfully updated ${newData.code}`)
}

export default {
  ...client,
  getAsync: promisify(client.get).bind(client),
  delAsync: promisify(client.del).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client),
};
