import { Country } from "../types";
import redisClient, {
  getAllCountries,
  updateCountry,
} from "../api/redis-client";
import { threadId } from "worker_threads";

export const fetchAllCountries = async (): Promise<Country[]> => {
  const countries = await getAllCountries();
  return countries;
};

export const updateCountryPopulation = async (cid: any, pop: number) => {
  try {
    const existKey: string | null = await redisClient.getAsync(cid);
    console.log(existKey);
    if (existKey !== null) {
      const newData = JSON.parse(existKey);
      newData.population = pop;
      updateCountry(newData);
      return newData;
    } else {
      return "unknown key";
    }
  } catch (e) {
    throw new Error("something went wrong");
  }
};

export const deleteCountry = async (key: string) => {
  try {
    await redisClient.delAsync(key);
    return true;
  } catch (e) {
    return false;
  }
};

export const updateCountryData = async (key: string, name: string, pop: number) => {
    try {
        const existKey: string | null = await redisClient.getAsync(key);
        if (existKey !== null) {
          const newData = JSON.parse(existKey);
          newData.population = pop;
          newData.name = name
          updateCountry(newData);
          return newData;
        } else {
          return "unknown key";
        }
      } catch (e) {
        throw new Error("something went wrong");
      }
};
