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
        throw new Error(`${method} can't have a body.`);
      }
      break;
    // POST, PUT, PATCH requires a request body
    case "POST":
    case "PUT":
    case "PATCH":
      if (!request.body) {
        throw new Error(`${method} expects a request body.`);
      }
      // Check if body is a string
      if (typeof request.body !== "string") {
        throw new Error(`Request body for ${method} must be a JSON string`);
      }
      // Check if body is a JSON string
      try {
        JSON.parse(request.body);
      } catch {
        throw new Error(
          `Request body for ${method} must be a valid JSON string`,
        );
      }
      break;
    // Invalid HTTP method
    default:
      throw new Error(`Invalid HTTP method: ${method}.`);
  }
}

/**
 * Service layer function that calls fetch on the backend API
 * @param endpoint Url endpoint for the fetch
 * @param request RequestInit object, body is expected to be stringified beforehand
 * @returns <T> Promise type
 */
export default async function fetchHTTPClient<T>(
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
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! Status: ${response.status}`,
    );
  }

  if (response.status == 204) {
    return null as T;
  }

  return response.json();
}
