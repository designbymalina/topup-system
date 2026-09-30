import { clearAccessToken, getAccessToken } from './authStorage'

export class ApiError extends Error {
  status: number
  errors?: Record<string, string>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export class ConnectionError extends Error {
  constructor() {
    super('Nie można połączyć się z serwerem aplikacji.')
    this.name = 'ConnectionError'
  }
}

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '')

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let response: Response

  try {
    const headers = new Headers(options?.headers)
    const token = getAccessToken()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new ConnectionError()
  }

  const contentType = response.headers.get('content-type')

  const data = contentType?.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    if (response.status === 401 && path !== '/api/auth/login') {
      clearAccessToken()
    }

    throw new ApiError(
      data?.message ?? `HTTP error: ${response.status}`,
      response.status,
      data?.errors,
    )
  }

  return data as T
}
