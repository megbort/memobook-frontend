// The deployed build has no .env, so production must be the fallback.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://memobook-backend-production.up.railway.app';

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP error - status: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const send = <T>(method: string, path: string, body?: unknown) =>
  request<T>(path, { method, body: body === undefined ? undefined : JSON.stringify(body) });
