export default class HTTPError extends Error {
  public code: string;

  public status: number;

  constructor(message: string, code: string, status: number) {
    super(message);

    this.code = code;
    this.status = status;

    this.name = 'HTTPError';
    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}
