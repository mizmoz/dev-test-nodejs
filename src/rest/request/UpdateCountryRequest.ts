/**
 * Module Dependencies
 */
import * as yup from 'yup';

export default class UpdateCountryRequest {
  private static SCHEMA = yup
    .object()
    .shape({
      name: yup.string().min(3).max(100).optional(),
      coordinates: yup.array().of(yup.number().required()).length(2).optional(),
    })
    .required();

  public static parse(body: unknown): IUpdateCountryPayload {
    return UpdateCountryRequest.SCHEMA.validateSync(body, {
      stripUnknown: true,
    });
  }

  private constructor() {
    // noop
  }
}

interface IUpdateCountryPayload {
  name?: string;
  coordinates?: [number, number];
}
