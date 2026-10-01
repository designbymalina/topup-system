import { apiFetch } from './api'

import { DEFAULT_PAGE_SIZE } from '../config/constants'

import type {
  CreateSimCardRequest,
  SimCard,
} from '../types/SimCard'

export type PageResponse<T> = {
  content: T[]
  number: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export async function getSimCards(
  page = 0,
  size = DEFAULT_PAGE_SIZE,
): Promise<PageResponse<SimCard>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: 'id,desc',
  })

  return apiFetch<PageResponse<SimCard>>(
    `/api/sim-cards?${params.toString()}`,
  )
}

export async function createSimCard(
  simCard: CreateSimCardRequest,
): Promise<SimCard> {
  return apiFetch<SimCard>('/api/sim-cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(simCard),
  })
}

export async function updateSimCard(
  id: number,
  simCard: CreateSimCardRequest,
): Promise<SimCard> {
  return apiFetch<SimCard>(`/api/sim-cards/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(simCard),
  })
}

export async function deleteSimCard(id: number): Promise<void> {
  await apiFetch<void>(`/api/sim-cards/${id}`, {
    method: 'DELETE',
  })
}
