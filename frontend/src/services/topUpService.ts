import type { TopUp } from '../types/TopUp'

export type CreateTopUpRequest = {
  amount: number
}

export type PublicTopUpRequest = {
  phoneNumber: string
  amount: number
}

type ApiErrorResponse = {
  status: number
  message?: string
  errors?: Record<string, string>
}

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '')

async function handleApiError(
  response: Response,
): Promise<never> {
  const error: ApiErrorResponse = await response.json()

  const validationMessage = error.errors
    ? Object.values(error.errors)[0]
    : null

  throw new Error(
    validationMessage ??
    error.message ??
    'Nie udało się wykonać doładowania.',
  )
}

export async function getTopUps(simCardId: number): Promise<TopUp[]> {
  const response = await fetch(
    `${API_URL}/api/sim-cards/${simCardId}/top-ups`,
  )

  if (!response.ok) {
    await handleApiError(response)
  }

  return response.json()
}

export async function createTopUp(
  simCardId: number,
  request: CreateTopUpRequest,
): Promise<TopUp> {
  const response = await fetch(
    `${API_URL}/api/sim-cards/${simCardId}/top-ups`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    await handleApiError(response)
  }

  return response.json()
}

export async function createPublicTopUp(
  request: PublicTopUpRequest,
): Promise<TopUp> {
  const response = await fetch(
    `${API_URL}/api/top-ups`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    await handleApiError(response)
  }

  return response.json()
}
