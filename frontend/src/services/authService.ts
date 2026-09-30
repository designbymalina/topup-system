import { apiFetch } from './api'
import { setAccessToken } from './authStorage'

type LoginResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export async function login(username: string, password: string): Promise<void> {
  const response = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  setAccessToken(response.accessToken)
}
