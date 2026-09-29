import type {
  CreateSimCardRequest,
  SimCard,
  ValidationErrorResponse,
} from '../types/SimCard'

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '')

export async function getSimCards(): Promise<SimCard[]> {
  const response = await fetch(`${API_URL}/api/sim-cards`)

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }

  return response.json()
}

export async function createSimCard(
  simCard: CreateSimCardRequest
): Promise<SimCard> {
  const response = await fetch(`${API_URL}/api/sim-cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(simCard),
  })

  if (!response.ok) {
    const error: ValidationErrorResponse = await response.json()
    throw error
  }

  return response.json()
}

export async function updateSimCard(
  id: number,
  simCard: CreateSimCardRequest
): Promise<SimCard> {
  const response = await fetch(`${API_URL}/api/sim-cards/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(simCard),
  })

  if (!response.ok) {
    const error: ValidationErrorResponse = await response.json()
    throw error
  }

  return response.json()
}

export async function deleteSimCard(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/sim-cards/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }
}
