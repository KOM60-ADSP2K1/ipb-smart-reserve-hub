import { authSession } from '../auth/authSession';
import { ApiError } from './apiError';
import { getApiBaseUrl } from './config';

type RequestBody = BodyInit | Record<string, unknown> | undefined;

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: RequestBody;
};

function buildHeaders(body: RequestBody, headers: HeadersInit | undefined): Headers {
  const requestHeaders = new Headers(headers);
  const token = authSession.getAccessToken();

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (body !== undefined && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  return requestHeaders;
}

function buildBody(body: RequestBody): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (body instanceof FormData || typeof body === 'string' || body instanceof Blob) {
    return body;
  }

  return JSON.stringify(body);
}

async function readResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('Content-Type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest<TResponse>(path: string, options: ApiRequestOptions = {}): Promise<TResponse> {
  const response = await fetch(new URL(path, getApiBaseUrl()), {
    ...options,
    headers: buildHeaders(options.body, options.headers),
    body: buildBody(options.body),
  });

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const payload = await readResponse(response);

  if (!response.ok) {
    const detail = typeof payload === 'object' && payload !== null && 'detail' in payload ? payload.detail : payload;
    throw new ApiError(response.statusText || 'API request failed', response.status, detail);
  }

  return payload as TResponse;
}
