
export interface Country {
  name: string;
  code: string;
}

export interface CountryPopulation {
  country: string; // country code
  population: number;
}