package pl.dbm.topupsystem.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.entity.TopUp;
import pl.dbm.topupsystem.enums.SimCardStatus;
import pl.dbm.topupsystem.repository.SimCardRepository;
import pl.dbm.topupsystem.repository.TopUpRepository;

@SpringBootTest
class TopUpServiceIntegrationTest {

  @Autowired private TopUpService topUpService;

  @Autowired private SimCardRepository simCardRepository;

  @MockitoBean private TopUpRepository topUpRepository;

  @Test
  @Transactional
  void shouldTopUpSimCardAndSaveTopUp() {

    SimCard simCard = new SimCard();

    simCard.setPhoneNumber("+48501234567");
    simCard.setStatus(SimCardStatus.ACTIVE);
    simCard.setBalance(new BigDecimal("50.00"));
    simCard.setValidUntil(LocalDate.of(2027, 1, 31));

    SimCard savedSimCard = simCardRepository.save(simCard);

    when(topUpRepository.save(any(TopUp.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    TopUp result = topUpService.create(savedSimCard.getId(), new BigDecimal("30.00"));

    SimCard updatedSimCard = simCardRepository.findById(savedSimCard.getId()).orElseThrow();

    assertEquals(new BigDecimal("80.00"), updatedSimCard.getBalance());

    assertEquals(new BigDecimal("30.00"), result.getAmount());

    assertEquals(savedSimCard.getId(), result.getSimCard().getId());

    verify(topUpRepository).save(any(TopUp.class));
  }

  @Test
  void shouldRollbackSimCardBalanceWhenTopUpSaveFails() {
    SimCard simCard = new SimCard();

    simCard.setPhoneNumber("+48501234567");
    simCard.setStatus(SimCardStatus.ACTIVE);
    simCard.setBalance(new BigDecimal("52.00"));
    simCard.setValidUntil(LocalDate.of(2027, 1, 31));

    SimCard savedSimCard = simCardRepository.save(simCard);

    try {
      when(topUpRepository.save(any(TopUp.class)))
          .thenThrow(new RuntimeException("Database error"));

      assertThrows(
          RuntimeException.class,
          () -> topUpService.create(savedSimCard.getId(), new BigDecimal("30.00")));

      SimCard reloadedSimCard = simCardRepository.findById(savedSimCard.getId()).orElseThrow();

      assertEquals(new BigDecimal("52.00"), reloadedSimCard.getBalance());
    } finally {
      simCardRepository.deleteById(savedSimCard.getId());
    }
  }
}
