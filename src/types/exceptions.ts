export { HTTPError } from "@/http/fetchHTTPClient";

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
  }
}

export class InvalidArgumentsError extends Error {
  constructor(message = "Invalid arguments provided") {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized access") {
    super(message);
  }
}

export class ConflictError extends Error {
  constructor(message = "Resource conflict") {
    super(message);
  }
}

export class ValidationError extends Error {
  constructor(message = "Validation failed") {
    super(message);
  }
}

export class IllegalOperationError extends Error {
  constructor(message = "Illegal operation attempted") {
    super(message);
  }
}

export class MethodNotAllowedError extends Error {
  constructor(message = "Method not allowed") {
    super(message);
  }
}

export const getStatusCode = (error: Error | unknown): number => {
  if (error instanceof Error) {
    // Check if it's an HTTPError (which has status in constructor)
    if ("status" in error && typeof error.status === "number") {
      return error.status;
    }

    switch (error.constructor.name) {
      case "HTTPError":
        return (error as Error & { status: number }).status || 500;
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
      case "IllegalOperationError":
        return 403;
      case "MethodNotAllowedError":
        return 405;
      default:
        return 500;
    }
  }

  return 500;
};
