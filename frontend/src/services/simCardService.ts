import { apiFetch } from './api'

import type {
  CreateSimCardRequest,
  SimCard,
} from '../types/SimCard'

export async function getSimCards(): Promise<SimCard[]> {
  return apiFetch<SimCard[]>('/api/sim-cards')
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
