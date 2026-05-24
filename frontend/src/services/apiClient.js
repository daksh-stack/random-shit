import { apiUrl, env } from '../config/env.js';
import { getErrorMessage } from '../constants/errorMessages.js';

export class ApiError extends Error {
  constructor(message, code, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function parseErrorResponse(response) {
  try {
    const data = await response.json();
    return {
      code: data.error?.code || 'UNKNOWN',
      message: data.error?.message || getErrorMessage('UNKNOWN'),
      details: data.error?.details || null,
    };
  } catch {
    return {
      code: 'UNKNOWN',
      message: getErrorMessage('UNKNOWN'),
      details: null,
    };
  }
}

export async function apiRequest(path, options = {}) {
  const { timeoutMs = env.API_TIMEOUT_MS, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(apiUrl(path), {
      ...fetchOptions,
      signal: controller.signal,
    });

    return response;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(
        getErrorMessage('REQUEST_TIMEOUT'),
        'REQUEST_TIMEOUT',
        408
      );
    }
    throw new ApiError(
      getErrorMessage('NETWORK_ERROR'),
      'NETWORK_ERROR',
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiRequestJson(path, options = {}) {
  const response = await apiRequest(path, options);

  if (!response.ok) {
    const err = await parseErrorResponse(response);
    throw new ApiError(
      getErrorMessage(err.code, err.message),
      err.code,
      response.status,
      err.details
    );
  }

  const data = await response.json();

  if (data.success === false) {
    throw new ApiError(
      getErrorMessage(data.error?.code, data.error?.message),
      data.error?.code || 'UNKNOWN',
      response.status,
      data.error?.details
    );
  }

  return data;
}

export async function apiRequestBlob(path, options = {}) {
  const response = await apiRequest(path, options);

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const err = await parseErrorResponse(response);
      throw new ApiError(
        getErrorMessage(err.code, err.message),
        err.code,
        response.status,
        err.details
      );
    }
    throw new ApiError(getErrorMessage('UNKNOWN'), 'UNKNOWN', response.status);
  }

  return response.blob();
}
