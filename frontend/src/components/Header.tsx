import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="navbar navbar-expand-lg bg-body-tertiary border-bottom mb-4 py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={() => setShowMenu(false)}>
          <span className="fs-4 fw-bold text-primary">Prepaid Top-Up System - Doładowania telefonów</span>
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
              <Link className="nav-link" to="/" onClick={() => setShowMenu(false)}>Strona startowa</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin" onClick={() => setShowMenu(false)}>Panel Administracyjny</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/sim-cards" onClick={() => setShowMenu(false)}>Karty SIM</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/customers" onClick={() => setShowMenu(false)}>Klienci</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header
