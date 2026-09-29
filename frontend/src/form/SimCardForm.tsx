import { useEffect, useState, type FormEvent } from 'react'
import { createSimCard, updateSimCard } from '../services/simCardService'
import { getCustomers } from '../services/customerService'

import type { SimCard, ValidationErrorResponse } from '../types/SimCard'
import type { Customer } from '../types/Customer'

function SimCardForm({
  simCard,
  onCreated,
  onCancel,
}: {
  simCard?: SimCard
  onCreated: () => void
  onCancel: () => void
}) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [balance, setBalance] = useState('0')
  const [validUntil, setValidUntil] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error('Failed to load customers:', error)
      }
    }

    loadCustomers()
  }, [])

  useEffect(() => {
    if (simCard) {
      setPhoneNumber(simCard.phoneNumber)
      setStatus(simCard.status)
      setBalance(String(simCard.balance))
      setValidUntil(simCard.validUntil)
      setCustomerId(
        simCard.customer ? String(simCard.customer.id) : ''
      )
    } else {
      setPhoneNumber('')
      setStatus('ACTIVE')
      setBalance('0')
      setValidUntil('')
      setCustomerId('')
    }

    setErrors({})
  }, [simCard])

  function validateForm() {
    const validationErrors: Record<string, string> = {}

    if (!phoneNumber.trim()) {
      validationErrors.phoneNumber = 'Numer telefonu jest wymagany.'
    }

    if (balance === '') {
      validationErrors.balance = 'Wymagane jest podanie salda.'
    } else if (Number(balance) < 0) {
      validationErrors.balance = 'Saldo nie może być ujemne.'
    }

    if (!validUntil) {
      validationErrors.validUntil = 'Wymagana jest data ważności.'
    }

    setErrors(validationErrors)

    return Object.keys(validationErrors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const request = {
      phoneNumber,
      status,
      balance: Number(balance),
      validUntil,
      customerId: customerId ? Number(customerId) : null,
    }

    try {
      if (simCard) {
        await updateSimCard(simCard.id, request)
      } else {
        await createSimCard(request)
      }

      onCreated()
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null
      ) {
        const apiError = error as ValidationErrorResponse

        if (apiError.errors) {
          setErrors(apiError.errors)
          return
        }

        if (apiError.message) {
          setErrors({
            general: apiError.message,
          })
          return
        }
      }

      console.error('Failed to save SIM card:', error)
    }
  }

  return (
    <>
      {Object.keys(errors).length > 0 && (
        <div className="alert alert-danger">
          <p className="mb-0 fw-semibold">Proszę poprawić następujące błędy:</p>
          <ul className="mb-0">
            {Object.values(errors).map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="phoneNumber" className="form-label">Numer telefonu</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              className="form-control"
              value={phoneNumber}
              onChange={event => setPhoneNumber(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={status}
              onChange={event => setStatus(event.target.value)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="DEACTIVATED">DEACTIVATED</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="balance" className="form-label">Saldo / stan konta</label>
            <div className="input-group">
              <input
                id="balance"
                name="balance"
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={balance}
                onChange={event => setBalance(event.target.value)}
              />
              <span className="input-group-text">PLN</span>
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="validUntil" className="form-label">Ważne do</label>
            <input
              id="validUntil"
              name="validUntil"
              type="date"
              className="form-control"
              value={validUntil}
              onChange={event => setValidUntil(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="customer" className="form-label">Klient / użytkownik</label>
            <select
              id="customer"
              name="customer"
              className="form-select"
              value={customerId}
              onChange={event => setCustomerId(event.target.value)}
            >
              <option value="">- Wybierz klienta -</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <p className="d-inline-flex gap-1 mb-0">
              <button type="submit" className="btn btn-primary">
                {simCard ? 'Zapisz zmiany' : 'Zarejestruj kartę'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >Anuluj</button>
            </p>
          </div>
        </div>
      </form>
    </>
  )
}

export default SimCardForm
