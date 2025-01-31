const BASE_URL = '/api/v1';

// I wasn't sure if I should've done 1 function for all request methods or 1 each so I made 2 files.

export async function get<T>(endpoint: string, request: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...request,
    headers: {
      'Content-Type': 'application/json',
      ...request.headers,
    },
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}

export async function post<T>(endpoint: string, request: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...request,
    headers: {
      'Content-Type': 'application/json',
      ...request.headers,
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}

export async function patch<T>(endpoint: string, request: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...request,
    headers: {
      'Content-Type': 'application/json',
      ...request.headers,
    },
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}

export async function del(endpoint: string, request: RequestInit = {}): Promise<void> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...request,
    headers: {
      'Content-Type': 'application/json',
      ...request.headers,
    },
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  if (response.status === 204) {
    return;
  }

  throw new Error('Deletion failed');
}