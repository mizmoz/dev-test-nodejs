/**
 * Module Dependencies
 */

export default class GetCountryResponse implements IResponse<IPayload> {
  protected country: ICountry;

  constructor(country: ICountry) {
    this.country = country;
  }

  public toJSON(): IPayload {
    return {
      code: this.country.code,
      name: this.country.name,
      population: this.country.population ?? 0,
      coordinates: this.country.coordinates ?? null,
    };
  }
}

interface IPayload {
  code: string;
  name: string;
  population: number;
  coordinates: [number, number] | null;
}
