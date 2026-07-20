export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art';

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        error: json.message || json.error || Object.values(json.errors || {}).flat().join(', '),
      };
    }

    return { data: json, message: json.message };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Network error' };
  }
}

function buildFormData(body: Record<string, unknown>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(body)) {
    if (value instanceof File) {
      fd.append(key, value);
    } else if (value !== null && value !== undefined) {
      fd.append(key, String(value));
    }
  }
  return fd;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),

  upload: <T>(endpoint: string, body: Record<string, unknown>) =>
    request<T>(endpoint, { method: 'POST', body: buildFormData(body) }),
};
