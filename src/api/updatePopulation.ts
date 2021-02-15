import { NextFunction, Request, Response } from "express";
import { CountryPop } from "../types";
import { checkRedis } from "./checkRedis";

const editPopulation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  //get edit data
  const { code, newPop } = req.body;
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
          name: value.name,
          population: newPop as number,
        };
      }
      return value;
    });
    await client.set("countries", JSON.stringify(newData));
    res.send({
      Source: "editPopulation",
      Message: "Edit Successful",
      data: newData,
    });
  } catch (err) {
    res.send({
      Error: "editPopulation",
      Message: "countries api recieved an error",
      Details: err,
    });
  }
};

export { editPopulation };
