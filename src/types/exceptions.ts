export abstract class AppError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message);
  }
}

export class InvalidArgumentsError extends AppError {
  constructor(message = "Invalid arguments provided") {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message);
  }
}

export class IllegalOperationError extends AppError {
  constructor(message = "Illegal operation attempted") {
    super(message);
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(message = "Method not allowed") {
    super(message);
  }
}

export const getStatusCode = (error: Error): number => {
  switch (error.name) {
    case "NotFoundError":
      return 404;
    case "InvalidArgumentsError":
      return 400;
    case "UnauthorizedError":
      return 401;
    case "ConflictError":
      return 409;
    case "ValidationError":
      return 422;
    case "IllegalOperationsError":
      return 403;
    case "MethodNotAllowedError":
      return 405;
    default:
      return 500;
  }
};
