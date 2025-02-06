import {
  InternalError,
  InvalidArgumentsError,
  MethodNotAllowedError,
} from "@/types/exceptions";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const BASE_URL = "/api/v1";

/**
 * Verifies the fetchService parameters based on the method type, the standard is based on MDN standards
 * @param method HTTP method of request
 * @param request Request information
 */
function verifyFetchRequest(method: HttpMethod, request: RequestInit): void {
  switch (method) {
    // GET, DELETE doesn't have request body
    case "GET":
    case "DELETE":
      if (request.body) {
        throw new InvalidArgumentsError(`${method} can't have a body.`);
      }
      break;
    // POST, PUT, PATCH requires a request body
    case "POST":
    case "PUT":
    case "PATCH":
      if (!request.body) {
        throw new InvalidArgumentsError(`${method} expects a request body.`);
      }
      // Check if body is a string
      if (typeof request.body !== "string") {
        throw new InvalidArgumentsError(
          `Request body for ${method} must be a JSON string`,
        );
      }
      // Check if body is a JSON string
      try {
        JSON.parse(request.body);
      } catch {
        throw new InvalidArgumentsError(
          `Request body for ${method} must be a valid JSON string`,
        );
      }
      break;
    // Invalid HTTP method
    default:
      throw new MethodNotAllowedError(`Invalid HTTP method: ${method}.`);
  }
}

/**
 * Service layer function that calls fetch on the backend API
 * @param endpoint Url endpoint for the fetch
 * @param request RequestInit object, body is expected to be stringified beforehand
 * @returns <T> Promise type
 */
export default async function fetchService<T>(
  endpoint: string,
  request: RequestInit = {},
): Promise<T> {
  const httpMethod = (request.method as HttpMethod) || "NO METHOD PROVIDED";
  verifyFetchRequest(httpMethod, request);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...request,
    headers: {
      "Content-Type": "application/json",
      ...request.headers,
    },
  });

  if (!response.ok) {
    throw new InternalError(`${response.status}`);
  }

  if (response.status == 204) {
    return null as T;
  }

  return response.json();
}
