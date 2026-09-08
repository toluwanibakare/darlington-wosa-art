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
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),

  upload: <T>(endpoint: string, body: Record<string, unknown>) =>
    request<T>(endpoint, { method: 'POST', body: buildFormData(body) }),
};

export function getValidImageUrl(src: string | null | undefined, fallback: string = '/images/projects/IMG_5028.JPG'): string {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return fallback;
  }
  let clean = src.trim();

  if (clean.includes('placeholder.jpg')) {
    return fallback;
  }
  if (clean.includes('sample_sketch1.jpg') || clean.includes('sample_sketch2.jpg')) {
    return '/images/projects/IMG_5028.JPG';
  }
  if (clean.includes('sample_charcoal1.jpg') || clean.includes('sample_charcoal2.jpg')) {
    return '/images/projects/IMG_5029.JPG';
  }
  if (clean.includes('sample_frame1.jpg') || clean.includes('sample_frame2.jpg')) {
    return '/images/16_30.jpeg';
  }

  if (clean.includes('127.0.0.1:8000') || clean.includes('localhost:8000')) {
    clean = clean.replace(/^https?:\/\/[^\/]+/, 'https://api.darlingtonwosa.art');
  }

  if (clean.startsWith('storage/') || clean.startsWith('/storage/')) {
    const relativeStoragePath = clean.startsWith('/') ? clean : `/${clean}`;
    return `https://api.darlingtonwosa.art${relativeStoragePath}`;
  }

  return clean;
}
