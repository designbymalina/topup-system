import { apiFetch } from './api'
import type { DashboardSummary } from '../types/DashboardSummary'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>('/api/dashboard/summary')
}
