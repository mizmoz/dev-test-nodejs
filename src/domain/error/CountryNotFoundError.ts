export default class CountryNotFoundError extends Error {
  public reason?: Error;

  constructor(code: string, reason?: Error) {
    super(`Country ${code} not found.`);

    this.name = 'CountryNotFoundError';
    this.reason = reason;

    Object.setPrototypeOf(this, CountryNotFoundError.prototype);
  }
}
