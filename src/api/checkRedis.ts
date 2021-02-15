import { populateData } from "./readCountry";

const checkRedis = async (): Promise<boolean> => {
  //check if redis data has been set
  const client = global.redisClient;
  const setData: string | null = await client.get("setCountryData");
  if (setData && setData === "true") {
    return true;
  } else {
    await populateData();
  }
  return false;
};

export { checkRedis };
