import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import {
  clearAccessToken,
  getAccessToken,
  getAccessTokenExpiresAt,
  onAuthChange,
} from '../services/authStorage'

function RequireAuth() {
  const location = useLocation()
  const [authenticated, setAuthenticated] = useState(
    () => Boolean(getAccessToken()),
  )

  useEffect(() => {
    let expirationTimer: number | undefined

    function updateAuthentication() {
      if (expirationTimer !== undefined) {
        window.clearTimeout(expirationTimer)
      }

      const token = getAccessToken()
      setAuthenticated(Boolean(token))

      if (token) {
        const expiresAt = getAccessTokenExpiresAt()

        if (expiresAt) {
          expirationTimer = window.setTimeout(
            clearAccessToken,
            Math.max(0, expiresAt - Date.now()),
          )
        }
      }
    }

    const unsubscribe = onAuthChange(updateAuthentication)
    updateAuthentication()

    return () => {
      unsubscribe()

      if (expirationTimer !== undefined) {
        window.clearTimeout(expirationTimer)
      }
    }
  }, [])

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default RequireAuth
