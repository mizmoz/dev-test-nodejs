/**
 * Module Dependencies
 */
import * as yup from 'yup';

export default class UpdateCountryPopulationRequest {
  private static SCHEMA = yup
    .object()
    .shape({
      population: yup.number().min(0).required(),
    })
    .required();

  public static parse(body: unknown): IUpdateCountryPopulationPayload {
    return UpdateCountryPopulationRequest.SCHEMA.validateSync(body, {
      stripUnknown: true,
    });
  }

  private constructor() {
    // noop
  }
}

interface IUpdateCountryPopulationPayload {
  population: number;
}
