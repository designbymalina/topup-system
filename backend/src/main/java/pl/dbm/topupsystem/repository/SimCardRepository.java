package pl.dbm.topupsystem.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.dbm.topupsystem.entity.SimCard;

public interface SimCardRepository extends JpaRepository<SimCard, Long> {
  Optional<SimCard> findByPhoneNumber(String phoneNumber);

  boolean existsByPhoneNumber(String phoneNumber);
}
