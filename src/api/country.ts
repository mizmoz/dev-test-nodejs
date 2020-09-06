import countries from "../configs/country";
import { Country } from "../types";
import { Request, Response } from 'express';

/**
 * API to get the countries, sometimes this fails.
 *
 */
export async function all(): Promise<Country[]> {
  return [];
}

export async function get(code: string): Promise<Country | null> {
  return null;
}

export async function update(code: string, country: Country): Promise<Country> {

  return {
    name: "Philippines",
    code: "phi"
  };
}


