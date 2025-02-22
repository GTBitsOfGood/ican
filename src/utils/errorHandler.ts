import {
  AlreadyExistsError,
  BadRequestError,
  DoesNotExistError,
  InvalidBodyError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  InternalServerError,
  MethodNotAllowedError,
} from "@/types/exceptions";
import { NextResponse } from "next/server";

export const handleError = (error: unknown) => {
  let status = 500;
  let message = "Internal server error";

  if (error instanceof Error) {
    // Default error message are set in @/types/exceptions
    message = error.message || message;
    switch (true) {
      case error instanceof BadRequestError:
      case error instanceof InvalidBodyError:
        status = 400;
        break;
      case error instanceof UnauthorizedError:
        status = 401;
        break;
      case error instanceof DoesNotExistError:
      case error instanceof NotFoundError:
        status = 404;
        break;
      case error instanceof MethodNotAllowedError:
        status = 405;
        break;
      case error instanceof AlreadyExistsError:
      case error instanceof ConflictError:
        status = 409;
        break;
      case error instanceof InternalServerError:
        status = 500;
        break;
      default:
        status = 500;
        break;
    }
  } else {
    console.log("Unknown error:", error);
  }

  return NextResponse.json({ error: message }, { status });
};
