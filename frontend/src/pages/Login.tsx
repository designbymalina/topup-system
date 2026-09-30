import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaving(true)

    try {
      await login(username, password)

      const from = (
        location.state as { from?: { pathname?: string } } | null
      )?.from?.pathname

      navigate(from ?? '/admin', { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Logowanie nie powiodło się.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5 col-xl-4">
          <h1 className="h2 mb-4">Logowanie administratora</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Login
              </label>
              <input
                id="username"
                className="form-control"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Hasło
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100" disabled={saving}>
              {saving ? 'Logowanie…' : 'Zaloguj'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login
