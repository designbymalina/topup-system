package pl.dbm.topupsystem.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SimCardRequest {
  @NotBlank(message = "Numer telefonu jest wymagany")
  @Pattern(
      regexp = "^\\+[1-9]\\d{7,14}$",
      message = "Numer telefonu musi być w formacie międzynarodowym, np. +48123456789")
  private String phoneNumber;

  @NotBlank(message = "Status jest wymagany")
  @Pattern(
      regexp = "ACTIVE|BLOCKED|DEACTIVATED",
      message = "Status musi przyjmować wartość ACTIVE, BLOCKED lub DEACTIVATED")
  private String status;

  @NotNull(message = "Saldo jest wymagane")
  @DecimalMin(value = "0.00", inclusive = true, message = "Saldo nie może być ujemne")
  private BigDecimal balance;

  @NotNull(message = "Data ważności jest wymagana")
  @FutureOrPresent(message = "Data ważności nie może przypadać w przeszłości")
  private LocalDate validUntil;

  private Long customerId;

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public BigDecimal getBalance() {
    return balance;
  }

  public void setBalance(BigDecimal balance) {
    this.balance = balance;
  }

  public LocalDate getValidUntil() {
    return validUntil;
  }

  public void setValidUntil(LocalDate validUntil) {
    this.validUntil = validUntil;
  }

  public Long getCustomerId() {
    return customerId;
  }

  public void setCustomerId(Long customerId) {
    this.customerId = customerId;
  }
}
