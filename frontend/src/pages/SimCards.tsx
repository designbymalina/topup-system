import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { deleteSimCard, getSimCards } from '../services/simCardService'
import SimCardForm from '../form/SimCardForm'
import Alert from '../components/Alert'
import ConfirmModal from '../components/ConfirmModal'
import Loading from '../components/Loading'

import type { SimCard } from '../types/SimCard'

function SimCards() {
  const [simCards, setSimCards] = useState<SimCard[]>([])
  const [alert, setAlert] = useState<{
    type: 'success' | 'danger'
    message: string
  } | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSimCard, setEditingSimCard] = useState<SimCard | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSimCardId, setSelectedSimCardId] = useState<number | null>(null)

  const navigate = useNavigate()

  async function loadSimCards() {
    setLoading(true)
    setLoadError(null)

    try {
      const data = await getSimCards()
      setSimCards(data)
    } catch (error) {
      console.error(error)
      setLoadError(
        error instanceof Error
          ? error.message
          : 'Nie udało się pobrać listy kart SIM.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSimCards()
  }, [])

  async function handleSimCardSubmit() {
    const message = editingSimCard
      ? 'Karta SIM została pomyślnie zaktualizowana.'
      : 'Karta SIM została pomyślnie zarejestrowana.'

    setShowForm(false)
    setEditingSimCard(null)

    await loadSimCards()

    setAlert({
      type: 'success',
      message,
    })
  }

  async function handleDelete(id: number) {
    try {
      await deleteSimCard(id)

      setShowDeleteModal(false)
      setSelectedSimCardId(null)

      await loadSimCards()

      setAlert({
        type: 'success',
        message: 'Karta SIM została pomyślnie usunięta.',
      })
    } catch (error) {
      setShowDeleteModal(false)
      setSelectedSimCardId(null)

      setAlert({
        type: 'danger',
        message:
          error instanceof Error
            ? error.message
            : 'Nie udało się usunąć karty SIM.',
      })
    }
  }

  function handleCancel() {
    setShowForm(false)
    setEditingSimCard(null)
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
          <h1 className="h2 fw-bold text-dark mb-1">Karty SIM</h1>
          <p className="text-muted small mb-0">
            <Link to="/admin" className="link-dark text-decoration-none">
              Panel Administracyjny
            </Link>
            {' / '}Karty SIM
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingSimCard(null)
              setShowForm(true)
              setAlert(null)
            }}
          >
            Karta SIM
          </button>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="card-header fw-bold">
            {editingSimCard ? 'Edytuj kartę SIM' : 'Rejestracja karty SIM'}
          </div>
          <div className="card-body">
            <SimCardForm
              simCard={editingSimCard ?? undefined}
              onCreated={handleSimCardSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {loading && <Loading message="Ładowanie listy kart SIM..." />}

      {!loading && !showForm && (
        <div className="table-container">
          <table className="table table-striped">
            <thead>
            <tr className="table-primary">
              <th>ID</th>
              <th>Numer telefonu / SIM</th>
              <th>Saldo / stan konta</th>
              <th>Status</th>
              <th>Ważne do</th>
              <th>Klient / użytkownik</th>
              <th className="text-end" style={{ maxWidth: '10%' }}>
                Akcja
              </th>
            </tr>
            </thead>
            <tbody>
            {simCards.map((simCard) => (
              <tr key={simCard.id}>
                <td>{simCard.id}</td>
                <td>{simCard.phoneNumber}</td>
                <td>{simCard.balance.toFixed(2)} PLN</td>
                <td>{simCard.status}</td>
                <td>{simCard.validUntil}</td>
                <td className="table-success">
                  {simCard.customer
                    ? `${simCard.customer.firstName} ${simCard.customer.lastName}`
                    : 'Brak przypisanego klienta'}
                </td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() =>
                      navigate(`/admin/sim-cards/${simCard.id}/top-ups`)
                    }
                  >
                    Historia
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setEditingSimCard(simCard)
                      setShowForm(true)
                      setAlert(null)
                    }}
                  >
                    Edytuj
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setSelectedSimCardId(simCard.id)
                      setShowDeleteModal(true)
                    }}
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
          title="Usuń kartę SIM"
          message="Czy na pewno chcesz usunąć tę kartę SIM?"
          confirmLabel="Usuń"
          cancelLabel="Anuluj"
          onCancel={() => {
            setShowDeleteModal(false)
            setSelectedSimCardId(null)
          }}
          onConfirm={() => {
            if (selectedSimCardId !== null) {
              void handleDelete(selectedSimCardId)
            }
          }}
        />
      )}
    </main>
  )
}

export default SimCards
