export type Customer = {
  id: number
  firstName: string
  lastName: string
  pesel: string
}

export type CreateCustomerRequest = {
  firstName: string
  lastName: string
  pesel: string
}

export type ValidationErrorResponse = {
  status: number
  errors: Record<string, string>
}
