import { NextFunction, Request, Response } from "express";
import { CountryPop } from "../types";
import { checkRedis } from "./checkRedis";

const deleteCountry = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  //get edit data
  const { code } = req.body;
  //check if redis data has been set
  try {
    await checkRedis();

    const client = global.redisClient;
    const tempData = await client.get("countries");
    const data: CountryPop[] = JSON.parse(tempData as string);
    const newData: CountryPop[] = data.filter(value => {
      return value.code !== code;
    });
    await client.set("countries", JSON.stringify(newData));
    res.send({
      Source: "deleteCountry",
      Message: "Delete Successful",
      data: newData,
    });
  } catch (err) {
    res.send({
      Error: "deleteCountry",
      Message: "countries api recieved an error",
      Details: err,
    });
  }
};

export { deleteCountry };
