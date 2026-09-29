import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Alert from '../components/Alert'
import { Loading } from '../components/Loading'

import type { TopUp } from '../types/TopUp'

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '')

function TopUps() {
  const [topUps, setTopUps] = useState<TopUp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTopUps() {
      try {
        const simCardsResponse = await fetch(
          `${API_URL}/api/sim-cards`,
        )

        if (!simCardsResponse.ok) {
          throw new Error()
        }

        const simCards = await simCardsResponse.json()

        const topUpsBySimCard = await Promise.all(
          simCards.map(async (simCard: { id: number }) => {
            const response = await fetch(
              `${API_URL}/api/sim-cards/${simCard.id}/top-ups`,
)

if (!response.ok) {
  throw new Error()
}

return response.json()
}),
)

const allTopUps = topUpsBySimCard
  .flat()
  .sort(
    (a: TopUp, b: TopUp) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  )

setTopUps(allTopUps)
} catch {
  setError('Nie udało się pobrać historii doładowań.')
} finally {
  setLoading(false)
}
}

loadTopUps()
}, [])

return (
  <main className="container">
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4 gap-3">
      <div>
        <h1 className="h2 fw-bold text-dark mb-1">
          Wszystkie doładowania
        </h1>
        <p className="text-muted small mb-0">
          <Link
            to="/admin"
            className="link-dark text-decoration-none"
          >Panel Administracyjny</Link>
          {' / '}Wszystkie doładowania
        </p>
      </div>
    </div>

    {error && (
      <Alert type="danger" message={error} />
    )}

    {loading && (
      <Loading message="Pobieranie historii doładowań..." />
    )}

    {!loading && !error && topUps.length === 0 && (
      <Alert type="info" message="Brak doładowań." />
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
                {new Date(
                  topUp.createdAt,
                ).toLocaleString('pl-PL')}
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
)}

export default TopUps
