import type { Customer } from './Customer'

export type SimCard = {
  id: number
  phoneNumber: string
  status: string
  balance: number
  validUntil: string
  customer: Customer | null
}

export type CreateSimCardRequest = {
  phoneNumber: string
  status: string
  balance: number
  validUntil: string
  customerId: number | null
}

export type ValidationErrorResponse = {
  status: number
  errors?: Record<string, string>
  message?: string
}
