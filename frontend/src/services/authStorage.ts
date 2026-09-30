const TOKEN_KEY = 'topup_access_token'
const AUTH_CHANGE_EVENT = 'topup-auth-change'

function readTokenExpiration(token: string): number | null {
  try {
    const payload = token.split('.')[1]

    if (!payload) {
      return null
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      '=',
    )
    const claims = JSON.parse(atob(paddedBase64)) as { exp?: unknown }

    return typeof claims.exp === 'number' ? claims.exp * 1000 : null
  } catch {
    return null
  }
}

export function getAccessToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY)

  if (!token) {
    return null
  }

  const expiration = readTokenExpiration(token)

  if (!expiration || expiration <= Date.now()) {
    clearAccessToken()
    return null
  }

  return token
}

export function getAccessTokenExpiresAt(): number | null {
  const token = sessionStorage.getItem(TOKEN_KEY)
  return token ? readTokenExpiration(token) : null
}

export function setAccessToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function clearAccessToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function onAuthChange(callback: () => void): () => void {
  window.addEventListener(AUTH_CHANGE_EVENT, callback)
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback)
}
