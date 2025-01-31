export class CustomError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class AlreadyExistsError extends CustomError {
  constructor(message: string) {
    super(409, message);
  }
}
