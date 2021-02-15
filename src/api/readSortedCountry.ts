import { NextFunction, Request, Response } from "express";
import { CountryPop } from "../types";
import { checkRedis } from "./checkRedis";

const listPopSortedCountries = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  //get sort order
  const { sort } = req.query;
  //check if redis data has been set
  try {
    await checkRedis();
    const client = global.redisClient;
    const tempData = await client.get("countries");
    const data: CountryPop[] = JSON.parse(tempData as string) as CountryPop[];
    let returnData: CountryPop[];
    //sort data
    if (sort && data) {
      switch ((sort as string).toLowerCase()) {
        case "desc":
          returnData = data.sort((a, b) =>
            a.population < b.population ? 1 : -1,
          );
          break;
        case "asc":
        default:
          returnData = data.sort((a, b) =>
            a.population > b.population ? 1 : -1,
          );
          break;
      }
    } else {
      returnData = data.sort((a, b) => (a.population > b.population ? 1 : -1));
    }
    res.send(returnData);
  } catch (err) {
    res.send({
      Error: "listPopSortedCountries",
      Message: "countries api recieved an error",
      Details: err,
    });
  }
};

export { listPopSortedCountries };
