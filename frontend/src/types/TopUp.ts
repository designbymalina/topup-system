import type { SimCard } from './SimCard'

export type TopUp = {
  id: number
  amount: number
  createdAt: string
  simCard: SimCard
}
