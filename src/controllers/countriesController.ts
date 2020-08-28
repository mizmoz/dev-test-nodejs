import { Country } from "../types";
import { Request, Response } from "express";

import redisClient from "../redis";

export const getAll = async (req: Request, res: Response) => {
  const cachedCountries = await redisClient.getAsync("countries");
  const arrayCountries = JSON.parse(cachedCountries) || [];
  const ret = arrayCountries.map((country: Country) => {
    if (country && !country.hasOwnProperty("population")) {
      return {
        ...country,
        population: 0,
      };
    }
    return country;
  });

  const { sort = null, order = null } = req.query;

  if (sort === "population" && order !== null) {
    const sorted = ret.sort((a: any, b: any) =>
      a.hasOwnProperty("population") &&
      b.hasOwnProperty("population") &&
      a.population > b.population &&
      order === "asc"
        ? 1
        : -1,
    );

    return res.json(sorted);
  }

  return res.json(ret);
};

export const add = async (req: Request, res: Response) => {
  const cachedCountries = await redisClient.getAsync("countries");
  const arrayCountries = JSON.parse(cachedCountries)|| [];

  const newItemKeys = Object.keys(req.body);

  if (arrayCountries && newItemKeys.includes("name") && newItemKeys.includes("code")) {
    const { name, code, population = 0 }: Country = req.body;

    console.log(arrayCountries)
    await redisClient.setAsync(
      "countries",
      JSON.stringify([...arrayCountries, { name, code, population }]),
    );

    return res.json({ success: true });
  }
  return res.json({ success: false });
};

export const edit = async (req: Request, res: Response) => {
  const cachedCountries = await redisClient.getAsync("countries");
  const arrayCountries = JSON.parse(cachedCountries) || [];

  const newItemKeys = Object.keys(req.body);

  const isExists =
    newItemKeys.includes("code") &&
    arrayCountries.find(
      (country: Country) => country.code === req.body.code,
    );

  if (newItemKeys.includes("name") && isExists) {
    const updatedCountries = arrayCountries.map((country: Country) => {
      if (country.code === req.body.code) {
        return {
          ...country,
          name: req.body.name,
          population: newItemKeys.includes("population")
            ? req.body.population
            : country.population, //  chec body if have population
        };
      }
      return country
    });

    await redisClient.setAsync("countries", JSON.stringify(updatedCountries));

    return res.json({ updated: true });
  }
  return res.json({ updated: false });
};

export const remove = async (req: Request, res: Response) => {
  const cachedCountries = await redisClient.getAsync("countries");
  const arrayCountries = JSON.parse(cachedCountries) || [];

  const newItemKeys = Object.keys(req.body);

  const isExists =
    newItemKeys.includes("code") &&
    arrayCountries.find(
      (country: Country) => country && country.code === req.body.code,
    );

  if (isExists) {
    const updatedCountries = arrayCountries.filter(
      (country: Country) => country.code !== req.body.code,
    );

    await redisClient.setAsync("countries", JSON.stringify(updatedCountries));

    return res.json({ deleted: true });
  }
  return res.json({ deleted: false, errorMsg: "Country code does not exists" });
};
