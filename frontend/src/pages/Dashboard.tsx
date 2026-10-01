import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getDashboardSummary } from '../services/dashboardService'
import type { DashboardSummary } from '../types/DashboardSummary'
import Alert from '../components/Alert'
import Loading from '../components/Loading'

function Dashboard() {
  // Przykładowe dane dla sekcji statystyk i tabel
  const [stats, setStats] = useState({
    customers: { count: '8.940', active: '8.120', newToday: '42', path: '/admin/customers' },
    topUps: { totalVolume: '145.200 zł', countToday: '320', successRate: '99.2%', path: '/admin/top-ups' },
    packages: { activePlans: '12', popular: 'GigaPaczka 50GB', Revenue: '34.500 zł', path: '/admin/packages' }
  })

  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSummary = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setSummary(await getDashboardSummary())
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Nie udało się pobrać statystyk dashboardu.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSummary()
  }, [loadSummary])

  function formatCount(value: number | undefined) {
    return value === undefined ? '—' : new Intl.NumberFormat('pl-PL').format(value)
  }

  function formatCurrency(value: number | undefined) {
    return value === undefined
      ? '—'
      : new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
      }).format(value)
  }

  return (
    <main className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4 gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Panel Administracyjny</h1>
          <p className="text-muted small mb-0">System Prepaid Top-Up • Przegląd bieżących operacji i metryk</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-2">
            <i className="bi bi-download"></i> Eksportuj raport
          </button>
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            onClick={() => void loadSummary()}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise"></i> Odśwież dane
          </button>
        </div>
      </div>

      {error && <Alert type="danger" message={error} />}

      {loading && <Loading message="Pobieranie statystyk..." />}

      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden transition-all hover-translate-y">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="p-3 bg-primary-subtle text-primary rounded-3">
                  <i className="bi bi-sim display-6 lh-1"></i>
                </div>
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                  {formatCount(summary?.simCards.active)} aktywne
                </span>
              </div>
              <h6 className="card-subtitle text-muted fw-semibold small text-uppercase tracking-wider">Karty SIM</h6>
              <h2 className="card-title display-6 fw-bold my-2 text-dark">{formatCount(summary?.simCards.count)}</h2>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <span className="text-danger small fw-medium">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> {formatCount(summary?.simCards.alert)} wymaga uwagi
                </span>
                <Link
                  to="/admin/sim-cards"
                  className="btn btn-link btn-sm text-decoration-none p-0 fw-semibold text-primary"
                >
                  Zarządzaj <i className="bi bi-chevron-right small"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden transition-all hover-translate-y">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="p-3 bg-success-subtle text-success rounded-3">
                  <i className="bi bi-people display-6 lh-1"></i>
                </div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                  +{stats.customers.newToday} dzisiaj
                </span>
              </div>
              <h6 className="card-subtitle text-muted fw-semibold small text-uppercase tracking-wider">Klienci i Użytkownicy</h6>
              <h2 className="card-title display-6 fw-bold my-2 text-dark">{stats.customers.count}</h2>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <span className="text-muted small">Aktywni: <strong>{stats.customers.active}</strong></span>
                <a href={stats.customers.path} className="btn btn-link btn-sm text-decoration-none p-0 fw-semibold text-primary">
                  Lista <i className="bi bi-chevron-right small"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden transition-all hover-translate-y">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-3">
                  <i className="bi bi-cash-coin display-6 lh-1"></i>
                </div>
                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill">
                  {stats.topUps.countToday} doładowań dzisiaj
                </span>
              </div>
              <h6 className="card-subtitle text-muted fw-semibold small text-uppercase tracking-wider">Obrót Doładowań (Miesiąc)</h6>
              <h2 className="card-title display-6 fw-bold my-2 text-dark">{stats.topUps.totalVolume}</h2>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <span className="text-success small fw-medium">Skuteczność: {stats.topUps.successRate}</span>
                <a href={stats.topUps.path} className="btn btn-link btn-sm text-decoration-none p-0 fw-semibold text-primary">
                  Raport <i className="bi bi-chevron-right small"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden transition-all hover-translate-y">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="p-3 bg-info-subtle text-info-emphasis rounded-3">
                  <i className="bi bi-box-seam display-6 lh-1"></i>
                </div>
                <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill">
                  {stats.packages.activePlans} Pakietów w ofercie
                </span>
              </div>
              <h6 className="card-subtitle text-muted fw-semibold small text-uppercase tracking-wider">Najpopularniejszy Pakiet</h6>
              <h2 className="card-title h3 fw-bold my-2 text-dark truncate-1-line">{stats.packages.popular}</h2>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <span className="text-muted small">Przychód: <strong>{stats.packages.Revenue}</strong></span>
                <a href="#" className="btn btn-link btn-sm text-decoration-none p-0 fw-semibold text-dark">
                  Konfiguruj <i className="bi bi-chevron-right small"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
