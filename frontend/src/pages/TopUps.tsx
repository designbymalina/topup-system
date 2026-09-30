import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  deleteTopUp,
  getAllTopUps,
} from '../services/topUpService'
import Alert from '../components/Alert'
import ConfirmModal from '../components/ConfirmModal'
import Loading from '../components/Loading'

import type { TopUp } from '../types/TopUp'

function TopUps() {
  const [topUps, setTopUps] = useState<TopUp[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTopUpId, setSelectedTopUpId] = useState<number | null>(null)
  const [alert, setAlert] = useState<{
    type: 'success' | 'danger'
    message: string
  } | null>(null)

  async function loadTopUps() {
    setLoading(true)
    setLoadError(null)

    try {
      const data = await getAllTopUps()
      setTopUps(data)
    } catch (error) {
      console.error(error)
      setLoadError(
        error instanceof Error
          ? error.message
          : 'Nie udało się pobrać historii doładowań.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTopUps()
  }, [])

  function handleDelete(topUpId: number) {
    setSelectedTopUpId(topUpId)
    setShowDeleteModal(true)
  }

  async function confirmDelete() {
    if (selectedTopUpId === null) {
      return
    }

    try {
      await deleteTopUp(selectedTopUpId)

      setShowDeleteModal(false)
      setSelectedTopUpId(null)

      await loadTopUps()

      setAlert({
        type: 'success',
        message: 'Doładowanie zostało usunięte.',
      })
    } catch (error) {
      setShowDeleteModal(false)
      setSelectedTopUpId(null)

      setAlert({
        type: 'danger',
        message:
          error instanceof Error
            ? error.message
            : 'Nie udało się usunąć doładowania.',
      })
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false)
    setSelectedTopUpId(null)
  }

  if (loadError) {
    return (
      <main className="container">
        <Alert type="danger" message={loadError} />
      </main>
    )
  }

  return (
    <main className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4 gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Wszystkie doładowania</h1>
          <p className="text-muted small mb-0">
            <Link to="/admin" className="link-dark text-decoration-none">
              Panel Administracyjny
            </Link>
            {' / '}Wszystkie doładowania
          </p>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {loading && <Loading message="Pobieranie historii doładowań..." />}

      {!loading && topUps.length === 0 && (
        <Alert type="info" message="Brak doładowań." />
      )}

      {!loading && topUps.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
            <tr className="table-primary">
              <th>ID</th>
              <th>Telefon</th>
              <th>Kwota</th>
              <th>Klient</th>
              <th>Data</th>
              <th className="text-end">Akcja</th>
            </tr>
            </thead>
            <tbody>
            {topUps.map((topUp) => (
              <tr key={topUp.id}>
                <td>{topUp.id}</td>
                <td>{topUp.simCard.phoneNumber}</td>
                <td>{topUp.amount.toFixed(2)} PLN</td>
                <td>
                  {topUp.simCard.customer
                    ? `${topUp.simCard.customer.firstName} ${topUp.simCard.customer.lastName}`
                    : 'Brak przypisanego klienta'}
                </td>
                <td>{new Date(topUp.createdAt).toLocaleString('pl-PL')}</td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(topUp.id)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Usuń doładowanie"
          message="Czy na pewno chcesz usunąć doładowanie?"
          confirmLabel="Usuń"
          cancelLabel="Anuluj"
          onCancel={cancelDelete}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </main>
  )
}

export default TopUps
