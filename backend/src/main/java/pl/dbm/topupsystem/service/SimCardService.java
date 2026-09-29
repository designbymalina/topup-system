package pl.dbm.topupsystem.service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.exception.DuplicatePhoneNumberException;
import pl.dbm.topupsystem.repository.SimCardRepository;

@Service
public class SimCardService {

  private final SimCardRepository simCardRepository;

  public SimCardService(SimCardRepository simCardRepository) {
    this.simCardRepository = simCardRepository;
  }

  public List<SimCard> findAll() {
    return simCardRepository.findAll(Sort.by("id").descending());
  }

  public SimCard save(SimCard simCard) {

    if (simCardRepository.existsByPhoneNumber(simCard.getPhoneNumber())) {
      throw new DuplicatePhoneNumberException("Numer telefonu jest już przypisany do karty SIM.");
    }

    return simCardRepository.save(simCard);
  }

  public SimCard update(Long id, SimCard simCard) {

    SimCard existingSimCard = simCardRepository.findById(id).orElseThrow();

    Optional<SimCard> simCardWithPhoneNumber =
        simCardRepository.findByPhoneNumber(simCard.getPhoneNumber());

    if (simCardWithPhoneNumber.isPresent() && !simCardWithPhoneNumber.get().getId().equals(id)) {
      throw new DuplicatePhoneNumberException("Numer telefonu jest już przypisany do karty SIM.");
    }

    existingSimCard.setPhoneNumber(simCard.getPhoneNumber());
    existingSimCard.setStatus(simCard.getStatus());
    existingSimCard.setBalance(simCard.getBalance());
    existingSimCard.setValidUntil(simCard.getValidUntil());
    existingSimCard.setCustomer(simCard.getCustomer());

    return simCardRepository.save(existingSimCard);
  }

  public void delete(Long id) {
    SimCard simCard = simCardRepository.findById(id).orElseThrow();

    simCardRepository.delete(simCard);
  }
}
