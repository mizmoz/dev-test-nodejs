import { NextFunction, Request, Response } from "express";
import countries from "./country";
import { Country, CountryPop } from "../types";

const populateData = async (): Promise<Country[]> => {
  const client = global.redisClient;
  const tempData: Country[] = await countries();
  // add population data
  const data: CountryPop[] = tempData.map((value: Country, index: Number) => {
    const { name, code } = value;
    const maxPop = 100000000;
    const minPop = 1000000;
    return {
      name,
      code,
      population: Math.floor(Math.random() * (maxPop - minPop) + minPop),
    };
  });
  await client.set("countries", JSON.stringify(data));
  await client.set("setCountryData", "true");
  return tempData;
};
const listCountries = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    //check if redis data has been set
    const client = global.redisClient;
    const setData: string | null = await client.get("setCountryData");
    let data: Country[];
    if (setData && setData.toLowerCase() === "true") {
      const redisData: string | null = await client.get("countries");
      const tempData: CountryPop[] = JSON.parse(redisData as string);
      data = tempData.map(
        (value: CountryPop): Country => {
          const { name, code } = value;
          return { name, code };
        },
      );
    } else {
      data = await populateData();
    }
    res.send(data);
  } catch (err) {
    console.log("error at listCountries");
    res.send({
      Error: "listCountries",
      Message: "countries api recieved an error",
      Details: err,
    });
  }
};

export { listCountries, populateData };
