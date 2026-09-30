import { apiFetch } from './api'

import type { TopUp } from '../types/TopUp'

export type CreateTopUpRequest = {
  amount: number
}

export type PublicTopUpRequest = {
  phoneNumber: string
  amount: number
}

export async function getTopUps(
  simCardId: number,
): Promise<TopUp[]> {
  return apiFetch<TopUp[]>(
    `/api/sim-cards/${simCardId}/top-ups`,
  )
}

export async function getAllTopUps(): Promise<TopUp[]> {
  const simCards = await apiFetch<{ id: number }[]>(
    '/api/sim-cards',
  )

  const topUpsBySimCard = await Promise.all(
    simCards.map((simCard) =>
      getTopUps(simCard.id),
    ),
  )

  return topUpsBySimCard
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
}

export async function createTopUp(
  simCardId: number,
  request: CreateTopUpRequest,
): Promise<TopUp> {
  return apiFetch<TopUp>(
    `/api/sim-cards/${simCardId}/top-ups`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )
}

export async function createPublicTopUp(
  request: PublicTopUpRequest,
): Promise<TopUp> {
  return apiFetch<TopUp>('/api/top-ups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
}

export async function deleteTopUp(id: number): Promise<void> {
  await apiFetch<void>(`/api/top-ups/${id}`, {
    method: 'DELETE',
  })
}
