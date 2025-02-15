export class ApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AlreadyExistsError extends ApiError {
  constructor(message: string) {
    super(message);
  }
}

export class DoesNotExistError extends ApiError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidBodyError extends ApiError {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(message);
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor(message = "Method not allowed") {
    super(message);
  }
}
