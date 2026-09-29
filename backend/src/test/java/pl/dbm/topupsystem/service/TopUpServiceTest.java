package pl.dbm.topupsystem.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.entity.TopUp;
import pl.dbm.topupsystem.enums.SimCardStatus;
import pl.dbm.topupsystem.repository.SimCardRepository;
import pl.dbm.topupsystem.repository.TopUpRepository;

@ExtendWith(MockitoExtension.class)
class TopUpServiceTest {
  @Mock private TopUpRepository topUpRepository;

  @Mock private SimCardRepository simCardRepository;

  @InjectMocks private TopUpService topUpService;

  @Test
  void shouldTopUpSimCard() {
    SimCard simCard = new SimCard();

    simCard.setPhoneNumber("+48501234567");
    simCard.setStatus(SimCardStatus.ACTIVE);
    simCard.setBalance(new BigDecimal("50.00"));
    simCard.setValidUntil(LocalDate.of(2027, 1, 31));

    when(simCardRepository.findById(1L)).thenReturn(Optional.of(simCard));

    TopUp savedTopUp = new TopUp();
    savedTopUp.setSimCard(simCard);
    savedTopUp.setAmount(new BigDecimal("30.00"));

    when(topUpRepository.save(any(TopUp.class))).thenReturn(savedTopUp);

    TopUp result = topUpService.create(1L, new BigDecimal("30.00"));

    assertEquals(new BigDecimal("80.00"), simCard.getBalance());

    assertEquals(new BigDecimal("30.00"), result.getAmount());

    assertEquals(simCard, result.getSimCard());

    verify(simCardRepository).save(simCard);

    verify(topUpRepository).save(any(TopUp.class));
  }

  @Test
  void shouldFindTopUpsBySimCardId() {
    TopUp topUp1 = new TopUp();
    topUp1.setAmount(new BigDecimal("30.00"));

    TopUp topUp2 = new TopUp();
    topUp2.setAmount(new BigDecimal("50.00"));

    when(topUpRepository.findBySimCardIdOrderByCreatedAtDesc(5L))
        .thenReturn(List.of(topUp1, topUp2));

    List<TopUp> result = topUpService.findBySimCardId(5L);

    assertEquals(2, result.size());

    assertEquals(new BigDecimal("30.00"), result.get(0).getAmount());

    assertEquals(new BigDecimal("50.00"), result.get(1).getAmount());

    verify(topUpRepository).findBySimCardIdOrderByCreatedAtDesc(5L);
  }

  @Test
  void shouldPublicTopUpSimCard() {

    SimCard simCard = new SimCard();

    simCard.setPhoneNumber("+48123123123");
    simCard.setStatus(SimCardStatus.ACTIVE);
    simCard.setBalance(new BigDecimal("50.00"));
    simCard.setValidUntil(LocalDate.of(2027, 1, 31));

    when(simCardRepository.findByPhoneNumber("+48123123123")).thenReturn(Optional.of(simCard));

    TopUp savedTopUp = new TopUp();
    savedTopUp.setSimCard(simCard);
    savedTopUp.setAmount(new BigDecimal("30.00"));

    when(topUpRepository.save(any(TopUp.class))).thenReturn(savedTopUp);

    TopUp result = topUpService.createPublic("+48123123123", new BigDecimal("30.00"));

    assertEquals(new BigDecimal("80.00"), simCard.getBalance());

    assertEquals(new BigDecimal("30.00"), result.getAmount());

    assertEquals(simCard, result.getSimCard());

    verify(simCardRepository).save(simCard);
    verify(topUpRepository).save(any(TopUp.class));
  }
}
