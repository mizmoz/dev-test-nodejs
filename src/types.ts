
export interface ICountry {
  name: string;
  code: string;
  population: number;
}

export interface IUser {
  username: string;
  password: string;
}

export interface IOrder {
  [k: string]: any
}
