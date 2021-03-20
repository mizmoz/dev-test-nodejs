class CustomError extends Error {
  public status?: number;

  constructor(message: string, status: number) {
    super(message);

    this.message = message;
    this.status = status;
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}


export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ServerError extends CustomError {
  constructor(message: string) {
    super(message, 500);
  }
}
