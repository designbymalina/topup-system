package pl.dbm.topupsystem.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class PublicTopUpRequest {

  @NotBlank(message = "Numer telefonu jest wymagany.")
  @Pattern(
      regexp = "^\\+[1-9]\\d{7,14}$",
      message = "Numer telefonu musi być w formacie międzynarodowym, np. +48123456789.")
  private String phoneNumber;

  @NotNull(message = "Kwota doładowania jest wymagana.")
  @DecimalMin(
      value = "1.00",
      inclusive = true,
      message = "Kwota doładowania musi wynosić co najmniej 1.00 PLN.")
  private BigDecimal amount;

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }
}
