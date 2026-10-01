export type DashboardSummary = {
  simCards: {
    count: number
    active: number
    alert: number
  }
  customers: {
    count: number
  }
  topUps: {
    totalVolume: number
    countToday: number
  }
}
