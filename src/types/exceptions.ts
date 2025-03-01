export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class AlreadyExistsError extends ApiError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class DoesNotExistError extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InvalidBodyError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor(message = "Method not allowed") {
    super(message, 405);
  }
}

export const getStatusCode = (error: Error): number => {
  switch (error.name) {
    case "BadRequestError":
      return 400;
    case "InvalidBodyError":
      return 400;
    case "UnauthorizedError":
      return 401;
    case "NotFoundError":
      return 404;
    case "DoesNotExistError":
      return 404;
    case "MethodNotAllowedError":
      return 405;
    case "ConflictError":
      return 409;
    case "AlreadyExistsError":
      return 409;
    case "InternalServerError":
    default:
      return 500;
  }
};
