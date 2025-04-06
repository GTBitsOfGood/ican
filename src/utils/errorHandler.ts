import {
  ConflictError,
  InvalidArgumentsError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  IllegalOperationError,
} from "@/types/exceptions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const handleError = (error: unknown) => {
  let status = 500;
  let message = "Internal server error";

  if (error instanceof Error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");

      return NextResponse.json(
        {
          error: errorMessage,
        },
        { status: 400 },
      );
    }

    // Default error message are set in @/types/exceptions
    message = error.message || message;
    switch (true) {
      case error instanceof InvalidArgumentsError:
        status = 400;
        break;
      case error instanceof UnauthorizedError:
        status = 401;
        break;
      case error instanceof NotFoundError:
        status = 404;
        break;
      case error instanceof MethodNotAllowedError:
        status = 405;
        break;
      case error instanceof ConflictError:
        status = 409;
        break;
      case error instanceof ValidationError:
        status = 422;
        break;
      case error instanceof IllegalOperationError:
        status = 403;
        break;
      default:
        status = 500;
        break;
    }
  } else {
    // Any unknown errors are defaulted to 500 and "Internal server error" and logged
    console.log("Unknown error:", error);
  }

  return NextResponse.json({ error: message }, { status });
};
