
export interface Country {
  name: string;
  code: string;
  population: number;
}

export interface CountryDTO {
  name: string;
  population: number;
}


export interface User {
  username: string;
  password?: string;
}

export interface QueryParams {
  sort?: string;
}
