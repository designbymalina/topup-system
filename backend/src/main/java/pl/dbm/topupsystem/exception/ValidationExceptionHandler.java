package pl.dbm.topupsystem.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ValidationExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, Object> handleValidationException(MethodArgumentNotValidException exception) {
    Map<String, String> errors = new HashMap<>();

    exception
        .getBindingResult()
        .getFieldErrors()
        .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

    Map<String, Object> response = new HashMap<>();

    response.put("status", 400);
    response.put("errors", errors);

    return response;
  }

  @ExceptionHandler(SimCardNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Map<String, Object> handleSimCardNotFound(SimCardNotFoundException exception) {
    Map<String, Object> response = new HashMap<>();

    response.put("status", 404);
    response.put("message", exception.getMessage());

    return response;
  }

  @ExceptionHandler(InactiveSimCardException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public Map<String, Object> handleInactiveSimCard(InactiveSimCardException exception) {
    Map<String, Object> response = new HashMap<>();

    response.put("status", 409);
    response.put("message", exception.getMessage());

    return response;
  }

  @ExceptionHandler(DuplicatePhoneNumberException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public Map<String, Object> handleDuplicatePhoneNumber(DuplicatePhoneNumberException exception) {
    Map<String, Object> response = new HashMap<>();

    response.put("status", 409);
    response.put("message", exception.getMessage());

    return response;
  }

  @ExceptionHandler(CustomerHasSimCardsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public Map<String, Object> handleCustomerHasSimCards(CustomerHasSimCardsException exception) {
    Map<String, Object> response = new HashMap<>();

    response.put("status", 409);
    response.put("message", exception.getMessage());

    return response;
  }
}
