// Centralized API client.
// Every api/*.js module goes through here so error handling,
// the base URL, and request shape stay in one place.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088';

/**
 * A normalized error shape every page can rely on.
 * kind: 'network' | 'not_found' | 'bad_request' | 'server' | 'unknown'
 */
class ApiError extends Error {
  constructor(message, kind, status) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

function classify(status) {
  if (status === 404) return 'not_found';
  if (status === 400) return 'bad_request';
  if (status >= 500) return 'server';
  return 'unknown';
}

function friendlyMessage(kind, status) {
  switch (kind) {
    case 'network':
      return 'Could not reach the backend. Check that the Spring Boot server is running on ' + BASE_URL + '.';
    case 'not_found':
      return 'Nothing was found for that request (404).';
    case 'bad_request':
      return 'The backend rejected this request — check the values you entered (400).';
    case 'server':
      return 'The backend ran into an error processing this request (500). Some inputs (like an out-of-range rating) are known to trigger this — see the project notes.';
    default:
      return `Request failed${status ? ` (status ${status})` : ''}.`;
  }
}

async function request(path, { method = 'GET', params, body } = {}) {
  let url = `${BASE_URL}${path}`;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const qs = query.toString();
    if (qs) url += `?${qs}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(friendlyMessage('network'), 'network');
  }

  // Some endpoints return plain text (e.g. "Login Successful", delete confirmations)
  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();
  const data = contentType.includes('application/json') && raw ? JSON.parse(raw) : raw;

  if (!response.ok) {
    const kind = classify(response.status);
    throw new ApiError(friendlyMessage(kind, response.status), kind, response.status);
  }

  // Treat empty body / empty array / null as "empty", not an error — caller decides how to render it
  return data === '' ? null : data;
}

export const apiClient = {
  get: (path, params) => request(path, { method: 'GET', params }),
  post: (path, body, params) => request(path, { method: 'POST', body, params }),
  put: (path, body, params) => request(path, { method: 'PUT', body, params }),
  del: (path, params) => request(path, { method: 'DELETE', params }),
};

export { ApiError, BASE_URL };
