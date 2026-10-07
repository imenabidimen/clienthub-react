const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export async function api(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(API_URL + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('auth-expired'));
    throw new Error('Session expired');
  }

  if (!response.ok) {
    let message = 'API request failed';
    try {
      const body = await response.json();
      message = body.message ?? message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}
