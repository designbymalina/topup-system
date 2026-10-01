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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.enums.SimCardStatus;
import pl.dbm.topupsystem.repository.SimCardRepository;

@ExtendWith(MockitoExtension.class)
class SimCardServiceTest {

  @Mock private SimCardRepository simCardRepository;

  @InjectMocks private SimCardService simCardService;

  @Mock private AuditLogService auditLogService;

  @Test
  void shouldReturnPageOfSimCards() {
    List<SimCard> simCards = List.of(new SimCard(), new SimCard());
    Pageable pageable = PageRequest.of(0, 10);
    Page<SimCard> expectedPage = new PageImpl<>(simCards, pageable, simCards.size());

    when(simCardRepository.findAll(pageable)).thenReturn(expectedPage);

    Page<SimCard> result = simCardService.findAll(pageable);

    assertEquals(simCards, result.getContent());
    verify(simCardRepository).findAll(pageable);
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
