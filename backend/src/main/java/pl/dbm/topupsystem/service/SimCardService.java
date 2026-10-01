package pl.dbm.topupsystem.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.enums.AuditAction;
import pl.dbm.topupsystem.enums.AuditEntityType;
import pl.dbm.topupsystem.exception.DuplicatePhoneNumberException;
import pl.dbm.topupsystem.repository.SimCardRepository;

@Service
public class SimCardService {

  private final SimCardRepository simCardRepository;
  private final AuditLogService auditLogService;

  public SimCardService(SimCardRepository simCardRepository, AuditLogService auditLogService) {
    this.simCardRepository = simCardRepository;
    this.auditLogService = auditLogService;
  }

  public Page<SimCard> findAll(Pageable pageable) {
    return simCardRepository.findAll(pageable);
  }

  @Transactional
  public SimCard save(SimCard simCard) {
    if (simCardRepository.existsByPhoneNumber(simCard.getPhoneNumber())) {
      throw new DuplicatePhoneNumberException("Numer telefonu jest już przypisany do karty SIM.");
    }

    SimCard savedSimCard = simCardRepository.save(simCard);
    auditLogService.record(AuditAction.CREATE, AuditEntityType.SIM_CARD, savedSimCard.getId());

    return savedSimCard;
  }

  @Transactional
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

    SimCard updatedSimCard = simCardRepository.save(existingSimCard);
    auditLogService.record(AuditAction.UPDATE, AuditEntityType.SIM_CARD, updatedSimCard.getId());

    return updatedSimCard;
  }

  @Transactional
  public void delete(Long id) {
    SimCard simCard = simCardRepository.findById(id).orElseThrow();

    simCardRepository.delete(simCard);
    auditLogService.record(AuditAction.DELETE, AuditEntityType.SIM_CARD, id);
  }
}
