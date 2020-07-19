
export interface ICountry {
  name: string;
  code: string;
}

export interface IPopulation extends ICountry {
  population?: number;
}

export interface ISort {
  order: 'asc' | 'desc';
}

export interface ICountryUpdateType {
  type: 'country' | 'population';
}
