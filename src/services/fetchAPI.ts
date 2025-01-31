// Should I move this into /services and I'm also not too sure what to name this file or have a specific fetch function for each service
// Also not too sure what to name this
const BASE_URL = '/api/v1'

// Should I have 1 function or 1 function for each request method (Get, patch, etc)
// Also wondering if I should have an explicit variable for body instead of request then spreading
export async function fetchAPI<T>(
  endpoint: string,
  request: RequestInit = {}
): Promise<T> {

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...request,
    headers: {
      'Content-Type': 'application/json',
      ...request.headers,
    },
  });

  // Not too sure on how to deal with errors / propogating them. Do I make a custom error class and where should I handle
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  if (response.status == 204) {
    return null as T;
  }

  return response.json();
}
