import createClient from 'openapi-fetch';
import type { paths } from './schema';

const BASE = import.meta.env.VITE_API_BASE;

// Create API Client
export const api = createClient<paths>({
  baseUrl: BASE,
});

// Middleware for authorization and curl logging
api.use({
  async onRequest({ request }) {
    const token = localStorage.getItem('authToken');
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }

    const url = request.url;
    const method = request.method;
    const headers = request.headers;

    let curl = `curl -X ${method} "${url}"`;

    headers.forEach((value: string, key: string) => {
      // Don't log the full token for security if you prefer, but the user asked for the equivalent curl command
      curl += ` -H "${key}: ${value}"`;
    });

    console.log(`%c[API Request] %c${curl}`, 'color: #6366f1; font-weight: bold;', 'color: #94a3b8;');
  },
  async onResponse({ response }) {
    const data = await response.clone().json().catch(() => null);
    console.log(`%c[API Response] %c${response.status} ${response.statusText}`, 'color: #10b981; font-weight: bold;', 'color: #94a3b8;', data);
    return response;
  }
});

export async function getVersion() {
  try {
    const { data, error } = await api.GET('/version');
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Failed to get version:', err);
    return { version: 'unknown' };
  }
}

