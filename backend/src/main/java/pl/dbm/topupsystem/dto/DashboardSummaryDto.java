package pl.dbm.topupsystem.dto;

import java.math.BigDecimal;

public record DashboardSummaryDto(SimCards simCards, Customers customers, TopUps topUps) {
  public record SimCards(long count, long active, long alert) {}

  public record Customers(long count) {}

  public record TopUps(BigDecimal totalVolume, long countToday) {}
}
