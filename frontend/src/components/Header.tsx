import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  clearAccessToken,
  getAccessToken,
  onAuthChange,
} from '../services/authStorage'

function Header() {
  const [showMenu, setShowMenu] = useState(false)
  const [authenticated, setAuthenticated] = useState(
    () => Boolean(getAccessToken()),
  )

  useEffect(() => {
    return onAuthChange(() => {
      setAuthenticated(Boolean(getAccessToken()))
    })
  }, [])

  function handleLogout() {
    clearAccessToken()
    setShowMenu(false)
  }

  return (
    <header className="navbar navbar-expand-lg bg-body-tertiary border-bottom mb-4 py-3">
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
          onClick={() => setShowMenu(false)}
        >
          <span className="fs-4 fw-bold text-primary">
            Platforma doładowań komórkowych
          </span>
        </Link>

        <button
          type="button"
          className="navbar-toggler"
          aria-label="Toggle navigation"
          aria-expanded={showMenu}
          onClick={() => setShowMenu(!showMenu)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${showMenu ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center mt-2 mt-lg-0 gap-lg-2">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/admin"
                onClick={() => setShowMenu(false)}
              >
                Panel Administracyjny
              </Link>
            </li>

            {authenticated ? (
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={handleLogout}
                >
                  Wyloguj
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/login"
                  onClick={() => setShowMenu(false)}
                >
                  Zaloguj
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header
