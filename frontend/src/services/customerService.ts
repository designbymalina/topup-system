import { apiFetch } from './api'

import type {
  CreateCustomerRequest,
  Customer,
} from '../types/Customer'

export async function getCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>('/api/customers')
}

export async function createCustomer(
  customer: CreateCustomerRequest,
): Promise<Customer> {
  return apiFetch<Customer>('/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  })
}

export async function updateCustomer(
  id: number,
  customer: CreateCustomerRequest,
): Promise<Customer> {
  return apiFetch<Customer>(`/api/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  })
}

export async function deleteCustomer(id: number): Promise<void> {
  await apiFetch<void>(`/api/customers/${id}`, {
    method: 'DELETE',
  })
}
