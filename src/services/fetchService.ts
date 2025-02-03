const BASE_URL = "/api/v1";

// Body variable, validate parameters
export async function fetchAPI<T>(
  endpoint: string,
  request: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...request,
    headers: {
      "Content-Type": "application/json",
      ...request.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  if (response.status == 204) {
    return null as T;
  }

  return response.json();
}
