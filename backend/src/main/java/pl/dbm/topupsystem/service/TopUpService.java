package pl.dbm.topupsystem.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.entity.TopUp;
import pl.dbm.topupsystem.enums.SimCardStatus;
import pl.dbm.topupsystem.exception.InactiveSimCardException;
import pl.dbm.topupsystem.exception.SimCardNotFoundException;
import pl.dbm.topupsystem.repository.SimCardRepository;
import pl.dbm.topupsystem.repository.TopUpRepository;

@Service
public class TopUpService {
  private final TopUpRepository topUpRepository;
  private final SimCardRepository simCardRepository;

  public TopUpService(TopUpRepository topUpRepository, SimCardRepository simCardRepository) {
    this.topUpRepository = topUpRepository;
    this.simCardRepository = simCardRepository;
  }

  public List<TopUp> findBySimCardId(Long simCardId) {
    return topUpRepository.findBySimCardIdOrderByCreatedAtDesc(simCardId);
  }

  @Transactional
  public TopUp create(Long simCardId, BigDecimal amount) {
    SimCard simCard = simCardRepository.findById(simCardId).orElseThrow();

    if (simCard.getStatus() != SimCardStatus.ACTIVE) {
      throw new IllegalStateException("SIM card is not active");
    }

    simCard.setBalance(simCard.getBalance().add(amount));

    simCardRepository.save(simCard);

    TopUp topUp = new TopUp();
    topUp.setSimCard(simCard);
    topUp.setAmount(amount);
    topUp.setCreatedAt(LocalDateTime.now());

    return topUpRepository.save(topUp);
  }

  @Transactional
  public TopUp createPublic(String phoneNumber, BigDecimal amount) {

    SimCard simCard =
        simCardRepository
            .findByPhoneNumber(phoneNumber)
            .orElseThrow(
                () ->
                    new SimCardNotFoundException(
                        "Nie znaleziono karty SIM dla podanego numeru telefonu."));

    if (simCard.getStatus() != SimCardStatus.ACTIVE) {
      throw new InactiveSimCardException("Karta SIM nie jest aktywna.");
    }

    simCard.setBalance(simCard.getBalance().add(amount));

    simCardRepository.save(simCard);

    TopUp topUp = new TopUp();
    topUp.setSimCard(simCard);
    topUp.setAmount(amount);
    topUp.setCreatedAt(LocalDateTime.now());

    return topUpRepository.save(topUp);
  }
}
