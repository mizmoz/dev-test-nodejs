/**
 * Module Dependencies
 */

export default class ListCountriesResponse implements IResponse<IPayload> {
  protected countries: ICountry[];

  constructor(countries: ICountry[]) {
    this.countries = countries;
  }

  public toJSON(): IPayload {
    return {
      countries: this.countries.map(country => ({
        code: country.code,
        name: country.name,
        population: country.population ?? 0,
        coordinates: country.coordinates ?? null,
      })),
    };
  }
}

interface IPayload {
  countries: IRowPayload[];
}

interface IRowPayload {
  code: string;
  name: string;
  population: number;
  coordinates: [number, number] | null;
}
