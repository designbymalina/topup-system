package pl.dbm.topupsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CustomerRequest {
  @NotBlank(message = "Imię jest wymagane")
  @Size(max = 100, message = "Imię nie może przekraczać 100 znaków")
  private String firstName;

  @NotBlank(message = "Nazwisko jest wymagane")
  @Size(max = 100, message = "Nazwisko nie może przekraczać 100 znaków")
  private String lastName;

  @NotBlank(message = "Numer PESEL jest wymagany")
  @Pattern(regexp = "^\\d{11}$", message = "Numer PESEL musi składać się dokładnie z 11 cyfr")
  private String pesel;

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getPesel() {
    return pesel;
  }

  public void setPesel(String pesel) {
    this.pesel = pesel;
  }
}
