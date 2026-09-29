package pl.dbm.topupsystem.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TopUpRequest {

  @NotNull(message = "Kwota doładowania jest wymagana.")
  @DecimalMin(
      value = "1.00",
      inclusive = true,
      message = "Kwota doładowania musi wynosić co najmniej 1.00 PLN.")
  private BigDecimal amount;

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }
}
