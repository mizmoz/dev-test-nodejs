import { NextFunction, Request, Response } from "express";
import { CountryPop } from "../types";
import { checkRedis } from "./checkRedis";

const editCountryName = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  //get edit data
  const { code, newName } = req.body;
  //check if redis data has been set
  try {
    await checkRedis();

    const client = global.redisClient;
    const tempData = await client.get("countries");
    const data: CountryPop[] = JSON.parse(tempData as string);
    const newData: CountryPop[] = data.map(value => {
      if (value.code.toLowerCase() === code.toLowerCase()) {
        return {
          code: value.code,
          name: (newName as string).toUpperCase(),
          population: value.population,
        };
      }
      return value;
    });
    await client.set("countries", JSON.stringify(newData));
    res.send({
      Source: "editCountryName",
      Message: "Edit Successful",
      data: newData,
    });
  } catch (err) {
    res.send({
      Error: "editCountryName",
      Message: "countries api recieved an error",
      Details: err,
    });
  }
};

export { editCountryName };
