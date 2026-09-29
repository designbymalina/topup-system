import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { deleteSimCard, getSimCards } from '../services/simCardService'
import SimCardForm from '../form/SimCardForm'
import Alert from '../components/Alert'
import ConfirmModal from '../components/ConfirmModal'
import { Loading } from '../components/Loading'

import type { SimCard } from '../types/SimCard'

function SimCards() {
  const [simCards, setSimCards] = useState<SimCard[]>([])
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSimCard, setEditingSimCard] = useState<SimCard | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSimCardId, setSelectedSimCardId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function loadSimCards() {
    try {
      const data = await getSimCards()
      setSimCards(data)
    } catch {
      setError(true)
    }
  }

  async function handleSimCardSubmit() {
    const message = editingSimCard
      ? 'Karta SIM została pomyślnie zaktualizowana.'
      : 'SIM card has been successfully registered.'

    setShowForm(false)
    setEditingSimCard(null)
    await loadSimCards()
    setSuccess(message)
  }

  useEffect(() => {
    loadSimCards()
    setLoading(false)
  }, [])

  async function handleDelete(id: number) {
    try {
      await deleteSimCard(id)
      await loadSimCards()

      setShowDeleteModal(false)
      setSelectedSimCardId(null)
      setSuccess('Karta SIM została pomyślnie usunięta.')
    } catch {
      setShowDeleteModal(false)
      setSelectedSimCardId(null)
      setError(true)
    }
  }

  function handleCancel() {
    setShowForm(false)
    setEditingSimCard(null)
  }

  // TODO: Docelowo przenieść wyżej, np. do App.
  if (error) {
    return (
      <main className="container">
        <Alert type="danger" message="Unable to connect to the server. Please try again later." />
      </main>
    )
  }

  return (
    <main className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4 gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Karty SIM</h1>
          <p className="text-muted small mb-0">
            <Link
              to="/admin"
              className="link-dark text-decoration-none"
            >Panel Administracyjny</Link>
            {` / `}Karty SIM
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingSimCard(null)
              setShowForm(true)
              setSuccess('')
            }}>Karta SIM</button>
        </div>
      </div>

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
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

      {loading && (
        <Loading message="Ładowanie listy..." />
      )}

      {!showForm && (
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
              <th className="text-end" style={{ maxWidth: '10%' }}>Akcja</th>
            </tr>
            </thead>
            <tbody>
            {simCards.map(simCard => (
              <tr key={simCard.id}>
                <td>{simCard.id}</td>
                <td>{simCard.phoneNumber}</td>
                <td>{simCard.balance.toFixed(2)} PLN</td>
                <td>{simCard.status}</td>
                <td>{simCard.validUntil}</td>
                <td className="table-success">
                  {simCard.customer
                    ? `${simCard.customer.firstName} ${simCard.customer.lastName}`
                    : '-'}
                </td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => navigate(`/admin/sim-cards/${simCard.id}/top-ups`)}
                  >Historia</button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setEditingSimCard(simCard)
                      setShowForm(true)
                      setSuccess('')
                    }}>Edytuj</button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setSelectedSimCardId(simCard.id)
                      setShowDeleteModal(true)
                    }}>Usuń</button>
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
              handleDelete(selectedSimCardId)
            }
          }}
        />
      )}
    </main>
  )
}

export default SimCards
