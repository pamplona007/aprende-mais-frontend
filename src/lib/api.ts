// Centralised axios client.
// The base URL comes from VITE_API_URL. When the request path is relative
// (e.g. '/api/users'), the Vite dev proxy handles routing — see vite.config.ts.
// When the path is absolute (e.g. 'http://...'), it goes straight to the backend.

import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
