package pl.dbm.topupsystem.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.enums.SimCardStatus;
import pl.dbm.topupsystem.repository.SimCardRepository;

@ExtendWith(MockitoExtension.class)
class SimCardServiceTest {

  @Mock private SimCardRepository simCardRepository;

  @InjectMocks private SimCardService simCardService;

  @Test
  void shouldReturnAllSimCards() {
    List<SimCard> simCards = List.of(new SimCard(), new SimCard());

    // Jeżeli repository zostanie wywołane, zwróć wartość.
    when(simCardRepository.findAll(any(Sort.class))).thenReturn(simCards);

    List<SimCard> result = simCardService.findAll();

    assertEquals(simCards, result);

    // Sprawdź, czy repository rzeczywiście zostało wywołane w ten sposób.
    verify(simCardRepository).findAll(any(Sort.class));
  }

  @Test
  void shouldSaveSimCard() {
    SimCard simCard = new SimCard();

    when(simCardRepository.save(simCard)).thenReturn(simCard);

    SimCard result = simCardService.save(simCard);

    assertEquals(simCard, result);

    verify(simCardRepository).save(simCard);
  }

  @Test
  void shouldUpdateSimCard() {
    Long id = 1L;

    SimCard existingSimCard = new SimCard();
    SimCard updatedSimCard = new SimCard();

    updatedSimCard.setPhoneNumber("+48501234567");
    updatedSimCard.setStatus(SimCardStatus.ACTIVE);
    updatedSimCard.setBalance(new BigDecimal("50.00"));
    updatedSimCard.setValidUntil(LocalDate.of(2026, 12, 31));

    when(simCardRepository.findById(id)).thenReturn(Optional.of(existingSimCard));

    when(simCardRepository.save(existingSimCard)).thenReturn(existingSimCard);

    SimCard result = simCardService.update(id, updatedSimCard);

    assertEquals(existingSimCard, result);

    assertEquals("+48501234567", existingSimCard.getPhoneNumber());
    assertEquals(SimCardStatus.ACTIVE, existingSimCard.getStatus());
    assertEquals(new BigDecimal("50.00"), existingSimCard.getBalance());
    assertEquals(LocalDate.of(2026, 12, 31), existingSimCard.getValidUntil());

    verify(simCardRepository).findById(id);
    verify(simCardRepository).save(existingSimCard);
  }

  @Test
  void shouldDeleteSimCard() {
    Long id = 1L;
    SimCard simCard = new SimCard();

    when(simCardRepository.findById(id)).thenReturn(Optional.of(simCard));

    simCardService.delete(id);

    verify(simCardRepository).findById(id);
    verify(simCardRepository).delete(simCard);
  }

  @Test
  void shouldThrowWhenDeletingNonExistingSimCard() {
    Long id = 999L;

    when(simCardRepository.findById(id)).thenReturn(Optional.empty());

    assertThrows(NoSuchElementException.class, () -> simCardService.delete(id));

    verify(simCardRepository).findById(id);
    verify(simCardRepository, never()).delete(any());
  }
}
