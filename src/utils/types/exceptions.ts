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

export class DoesNotExistError extends CustomError {
  constructor(message: string) {
    super(400, message);
  }
}

export class InvalidBodyError extends CustomError {
  constructor(message: string) {
    super(400, message);
  }
}
