import { NextFunction, Request, Response } from "express";
import { CountryPop } from "../types";
import { populateData } from "./readCountry";
import { checkRedis } from "./checkRedis";

const repopulateRedis = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    await populateData();
    const client = global.redisClient;
    const tempData = await client.get("countries");
    const newData = JSON.parse(tempData as string);
    res.send({
      Source: "repopulateRedis",
      Message: "Repopulation Successful",
      data: newData,
    });
  } catch (err) {
    res.send({
      Error: "repopulateRedis",
      Message: "countries api recieved an error",
      Details: err,
    });
  }
};

export { repopulateRedis };
