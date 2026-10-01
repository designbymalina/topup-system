package pl.dbm.topupsystem.repository;

import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.enums.SimCardStatus;

public interface SimCardRepository extends JpaRepository<SimCard, Long> {
  Optional<SimCard> findByPhoneNumber(String phoneNumber);

  boolean existsByPhoneNumber(String phoneNumber);

  boolean existsByCustomerId(Long customerId);

  long countByStatus(SimCardStatus status);

  @Query(
      """
    select count(s)
    from SimCard s
    where s.status is null
       or s.status <> :activeStatus
       or (s.validUntil is not null and s.validUntil < :today)
    """)
  long countRequiringAttention(
      @Param("activeStatus") SimCardStatus activeStatus, @Param("today") LocalDate today);
}
