package pl.dbm.topupsystem.exception;

public class DuplicatePhoneNumberException extends RuntimeException {

  public DuplicatePhoneNumberException(String message) {
    super(message);
  }
}
