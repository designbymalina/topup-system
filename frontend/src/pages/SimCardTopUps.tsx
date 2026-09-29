import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import { createTopUp, getTopUps } from '../services/topUpService'
import Alert from '../components/Alert'
import { Loading } from '../components/Loading';

import type { TopUp } from '../types/TopUp'
import SimCardForm from "../form/SimCardForm.tsx";

function SimCardTopUps() {
  const { id } = useParams()

  const [topUps, setTopUps] = useState<TopUp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formError, setFormError] = useState('')
  const [amount, setAmount] = useState('30')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const simCardId = Number(id)

  useEffect(() => {
    if (!simCardId) {
      setError('Nieprawidłowy numer SIM.')
      setLoading(false)
      return
    }

    getTopUps(simCardId)
      .then(data => {
        setTopUps(data)
      })
      .catch(() => {
        setError('Nie udało się pobrać historii doładowań.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [simCardId])

  const handleTopUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const topUpAmount = Number(amount)

    if (!topUpAmount || topUpAmount < 1) {
      setFormError('Kwota doładowania musi wynosić co najmniej 1 PLN.')
      return
    }

    setSaving(true)
    setFormError('')
    setSuccess('')

    try {
      await createTopUp(simCardId, {
        amount: topUpAmount,
      })

      const data = await getTopUps(simCardId)
      setTopUps(data)

      setShowForm(false)
      setSuccess('Doładowanie zostało wykonane.')
    } catch {
      setFormError('Nie udało się wykonać doładowania.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4 gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Historia doładowań</h1>
          <p className="text-muted small mb-0">
            <Link
              to="/admin"
              className="link-dark text-decoration-none"
            >Panel Administracyjny</Link>
            {` / `}<Link
              to="/admin/sim-cards"
              className="link-dark text-decoration-none"
            >Karty SIM</Link>
            {` / `}Historia doładowań
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setFormError('')
              setSuccess('')
              setShowForm(true)
            }}
          >Doładuj</button>
        </div>
      </div>

      {error && (
        <Alert type="danger" message={error} />
      )}

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {loading && (
        <Loading message="Pobieranie historii..." />
      )}

      {!loading && !error && topUps.length === 0 && (
        <Alert type="info" message="Brak doładowań dla tej karty SIM." />
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="card-header fw-bold">Doładuj kartę SIM</div>
          <div className="card-body">
            <form onSubmit={handleTopUp}>
              <div className="mb-3">
                <label
                  htmlFor="topUpAmount"
                  className="form-label"
                >Kwota doładowania</label>
                <div className="input-group">
                  <input
                    type="number"
                    id="topUpAmount"
                    className="form-control"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={event => setAmount(event.target.value)}
                    disabled={saving}
                  />
                  <span className="input-group-text">PLN</span>
                </div>
              </div>
              {formError && (
                <Alert type="danger" message={formError} />
              )}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >{saving ? 'Doładowywanie...' : 'Doładuj'}</button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >Anuluj</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!loading && !error && topUps.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
            <tr className="table-primary">
              <th>Data</th>
              <th>Kwota</th>
              <th>Telefon</th>
              <th>Klient</th>
            </tr>
            </thead>
            <tbody>
            {topUps.map(topUp => (
              <tr key={topUp.id}>
                <td>
                  {new Date(topUp.createdAt).toLocaleString('pl-PL')}
                </td>
                <td>
                  {topUp.amount.toFixed(2)} PLN
                </td>
                <td>
                  {topUp.simCard.phoneNumber}
                </td>
                <td>
                  {topUp.simCard.customer
                    ? `${topUp.simCard.customer.firstName} ${topUp.simCard.customer.lastName}`
                    : 'Brak przypisanego klienta'}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default SimCardTopUps
