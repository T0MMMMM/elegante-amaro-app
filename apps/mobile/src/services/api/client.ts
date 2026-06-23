import { config } from '@/src/constants/config';

/**
 * Client HTTP unique — SEUL endroit qui parle réellement à l'API.
 * Les services s'appuient dessus ; les écrans n'appellent jamais ceci directement.
 */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${config.apiBaseUrl}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
      ...options,
    });
  } catch {
    throw new Error(`Impossible de joindre l'API (${url}).`);
  }

  if (!res.ok) {
    let message = `Erreur API ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // corps non-JSON : on garde le message par défaut
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path: string) => request<void>(path, { method: 'DELETE' }),
};
