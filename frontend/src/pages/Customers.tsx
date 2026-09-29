import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { deleteCustomer, getCustomers } from '../services/customerService'
import CustomerForm from '../form/CustomerForm'
import Alert from '../components/Alert'
import ConfirmModal from '../components/ConfirmModal'

import type { Customer } from '../types/Customer'

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)

  async function loadCustomers() {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  function handleAddCustomer() {
    setEditingCustomer(null)
    setShowForm(true)
    setSuccess('')
  }

  function handleEditCustomer(customer: Customer) {
    setEditingCustomer(customer)
    setShowForm(true)
    setSuccess('')
  }

  async function handleCustomerSaved() {
    const wasEditing = editingCustomer !== null

    setShowForm(false)
    setEditingCustomer(null)

    await loadCustomers()

    setSuccess(
      wasEditing
        ? 'Dane klienta zostały pomyślnie zaktualizowane.'
        : 'Klient został pomyślnie dodany.'
    )
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

      setSuccess('Klient został pomyślnie usunięty.')
    } catch {
      setError(true)
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false)
    setSelectedCustomerId(null)
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
          <h1 className="h2 fw-bold text-dark mb-1">Klienci i użytkownicy</h1>
          <p className="text-muted small mb-0">
            <Link
              to="/admin"
              className="link-dark text-decoration-none"
            >Panel Administracyjny</Link>
            {` / `}Klienci i użytkownicy
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddCustomer}
          >Klient</button>
        </div>
      </div>

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            {editingCustomer ? 'Edytuj klienta' : 'Dodaj klienta'}
          </div>

          <div className="card-body">
            <CustomerForm
              customer={editingCustomer ?? undefined}
              onCreated={handleCustomerSaved}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {!showForm && (
      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr className="table-primary">
              <th>ID</th>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Numer PESEL</th>
              <th className="text-end" style={{ maxWidth: '10%' }}>
                Akcje
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map(customer => (
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
          onCancel={() => {
            setShowDeleteModal(false)
            setSelectedCustomerId(null)
          }}
          onConfirm={() => {
            if (selectedCustomerId !== null) {
              confirmDelete()
            }
          }}
        />
      )}
    </main>
  )
}

export default Customers
