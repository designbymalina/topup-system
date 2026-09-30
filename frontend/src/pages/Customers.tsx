import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { deleteCustomer, getCustomers } from '../services/customerService'
import CustomerForm from '../form/CustomerForm'
import Alert from '../components/Alert'
import ConfirmModal from '../components/ConfirmModal'
import Loading from '../components/Loading'

import type { Customer } from '../types/Customer'

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [alert, setAlert] = useState<{
    type: 'success' | 'danger'
    message: string
  } | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  )

  async function loadCustomers() {
    setLoading(true)
    setLoadError(null)

    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error(error)
      setLoadError(
        error instanceof Error
          ? error.message
          : 'Nie udało się pobrać listy klientów.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCustomers()
  }, [])

  function handleAddCustomer() {
    setEditingCustomer(null)
    setShowForm(true)
    setAlert(null)
  }

  function handleEditCustomer(customer: Customer) {
    setEditingCustomer(customer)
    setShowForm(true)
    setAlert(null)
  }

  async function handleCustomerSaved() {
    const wasEditing = editingCustomer !== null

    setShowForm(false)
    setEditingCustomer(null)

    await loadCustomers()

    setAlert({
      type: 'success',
      message: wasEditing
        ? 'Dane klienta zostały pomyślnie zaktualizowane.'
        : 'Klient został pomyślnie dodany.',
    })
  }

  function handleCancel() {
    setShowForm(false)
    setEditingCustomer(null)
  }

  function handleDelete(customerId: number) {
    setSelectedCustomerId(customerId)
    setShowDeleteModal(true)
  }

  async function confirmDelete() {
    if (selectedCustomerId === null) {
      return
    }

    try {
      await deleteCustomer(selectedCustomerId)

      setShowDeleteModal(false)
      setSelectedCustomerId(null)

      await loadCustomers()

      setAlert({
        type: 'success',
        message: 'Klient został pomyślnie usunięty.',
      })
    } catch (error) {
      setShowDeleteModal(false)
      setSelectedCustomerId(null)

      setAlert({
        type: 'danger',
        message:
          error instanceof Error
            ? error.message
            : 'Nie udało się usunąć klienta.',
      })
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false)
    setSelectedCustomerId(null)
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
          <h1 className="h2 fw-bold text-dark mb-1">Klienci i użytkownicy</h1>
          <p className="text-muted small mb-0">
            <Link to="/admin" className="link-dark text-decoration-none">
              Panel Administracyjny
            </Link>
            {' / '}Klienci i użytkownicy
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddCustomer}
        >
          Klient
        </button>
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
            {editingCustomer ? 'Edytuj klienta' : 'Rejestracja klienta'}
          </div>
          <div className="card-body">
            <CustomerForm
              customer={editingCustomer ?? undefined}
              onSaved={handleCustomerSaved}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {loading && <Loading message="Ładowanie listy klientów..." />}

      {!loading && !showForm && customers.length === 0 && (
        <Alert type="info" message="Brak klientów." />
      )}

      {!loading && !showForm && customers.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
            <tr className="table-primary">
              <th>ID</th>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>PESEL</th>
              <th className="text-end">Akcja</th>
            </tr>
            </thead>
            <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.pesel}</td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    Edytuj
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(customer.id)}
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
          title="Usuń klienta"
          message="Czy na pewno chcesz usunąć tego klienta?"
          confirmLabel="Usuń"
          cancelLabel="Anuluj"
          onCancel={cancelDelete}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </main>
  )
}

export default Customers
