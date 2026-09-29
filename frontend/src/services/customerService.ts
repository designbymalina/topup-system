import type {
  CreateCustomerRequest,
  Customer,
  ValidationErrorResponse,
} from '../types/Customer'

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '')

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_URL}/api/customers`)

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }

  return response.json()
}

export async function createCustomer(
  customer: CreateCustomerRequest
): Promise<Customer> {
  const response = await fetch(`${API_URL}/api/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  })

  if (!response.ok) {
    const error: ValidationErrorResponse = await response.json()
    throw error
  }

  return response.json()
}

export async function updateCustomer(
  id: number,
  customer: CreateCustomerRequest
): Promise<Customer> {
  const response = await fetch(`${API_URL}/api/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  })

  if (!response.ok) {
    const error: ValidationErrorResponse = await response.json()
    throw error
  }

  return response.json()
}

export async function deleteCustomer(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/customers/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }
}
