import { useEffect, useState, type FormEvent } from 'react'
import {
  createCustomer,
  updateCustomer,
} from '../services/customerService'

import type {
  Customer,
  ValidationErrorResponse,
} from '../types/Customer'

function CustomerForm({
  customer,
  onSaved,
  onCancel,
}: {
  customer?: Customer
  onSaved: () => void
  onCancel: () => void
}) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [pesel, setPesel] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (customer) {
      setFirstName(customer.firstName)
      setLastName(customer.lastName)
      setPesel(customer.pesel)
    } else {
      setFirstName('')
      setLastName('')
      setPesel('')
    }

    setErrors({})
  }, [customer])

  function validateForm() {
    const validationErrors: Record<string, string> = {}

    if (!firstName.trim()) {
      validationErrors.firstName = 'Imię jest wymagane.'
    }

    if (!lastName.trim()) {
      validationErrors.lastName = 'Nazwisko jest wymagane.'
    }

    if (!pesel.trim()) {
      validationErrors.pesel = 'Numer PESEL jest wymagany.'
    } else if (!/^\d{11}$/.test(pesel)) {
      validationErrors.pesel = 'Numer PESEL musi składać się z dokładnie 11 cyfr.'
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
      firstName,
      lastName,
      pesel,
    }

    try {
      if (customer) {
        await updateCustomer(customer.id, request)
      } else {
        await createCustomer(request)
      }

      onSaved()
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'errors' in error
      ) {
        const validationError = error as ValidationErrorResponse
        setErrors(validationError.errors)
        return
      }

      console.error('Nie udało się zapisać klienta:', error)
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
            <label htmlFor="firstName" className="form-label">Imię</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="form-control"
              value={firstName}
              onChange={event => setFirstName(event.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">Nazwisko</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="form-control"
              value={lastName}
              onChange={event => setLastName(event.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="pesel" className="form-label">Numer PESEL</label>
            <input
              id="pesel"
              name="pesel"
              type="text"
              inputMode="numeric"
              maxLength={11}
              className="form-control"
              value={pesel}
              onChange={event => setPesel(event.target.value)}
            />
          </div>
          <div className="col-12">
            <p className="d-inline-flex gap-1 mb-0">
              <button type="submit" className="btn btn-primary">
                {customer ? 'Zapisz zmiany' : 'Dodaj klienta'}
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

export default CustomerForm
