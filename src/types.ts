
export interface Country {
  id: number;
  name: string;
  code: string;
  population: number;
}

interface DBMethods {
  fetchAll(): Promise<Array<Country>>;
  fetchAllByPopulation(): Promise<Array<Country>>;
  updatePopulation(code: string, population: number): Promise<Boolean>;
  updateCountry(code: string, target: string, value: string | number): Promise<Country | null>;
  deleteCountry(code: string): Promise<Boolean>;
}

export interface CountryUpdate {
  target: string;
  value: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface DB {
  init(data: Array<any>): DBMethods;
}
