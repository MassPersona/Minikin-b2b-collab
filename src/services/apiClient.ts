const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: response.statusText,
    };
    try {
      error.data = await response.json();
    } catch {
      // no JSON body in error response
    }
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('minikin_auth_token');
  if (token && token !== 'demo-token') {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export const apiClient = {
  get<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },
  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },
  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },
  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },
  delete<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
