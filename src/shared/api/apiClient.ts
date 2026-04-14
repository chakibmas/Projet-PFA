const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

// ── Custom error class to carry HTTP status & server message ────────────────
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ── Core fetch wrapper with JWT + 401 handling ──────────────────────────────
async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('access_token');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  // Handle 401 → redirect to login
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    const next = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?next=${next}`;
    throw new ApiError('Unauthorized', 401);
  }

  // Parse response body (handle empty 204 responses)
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const msg = (data as { message?: string })?.message ?? response.statusText;
    throw new ApiError(msg, response.status, data);
  }

  return data as T;
}

// ── Public helpers (same signatures as before) ──────────────────────────────

/** Generic helper that unwraps response.data */
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const query = params ? '?' + new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)]),
  ).toString() : '';
  return request<T>(`${url}${query}`);
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T>(url: string): Promise<T> {
  return request<T>(url, { method: 'DELETE' });
}

/** Multipart form data upload */
export async function apiUpload<T>(url: string, formData: FormData): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    body: formData,
    // No Content-Type header — browser sets it with boundary automatically
  });
}

/** Extracts a human-readable error message from any error */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const msg = (error.data as { message?: string })?.message;
    return msg ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Une erreur inattendue est survenue.';
}
