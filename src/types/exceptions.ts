export abstract class AppError extends Error {
  public readonly statusCode: number;

  protected constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class InvalidArgumentsError extends AppError {
  constructor(message = "Invalid arguments provided") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409);
  }
}

export class InternalError extends AppError {
  constructor(message = "Internal error occurred") {
    super(message, 500);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 422);
  }
}

export class IllegalOperationError extends AppError {
  constructor(message = "Illegal operation attempted") {
    super(message, 403);
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(message = "Method not allowed") {
    super(message, 405);
  }
}
