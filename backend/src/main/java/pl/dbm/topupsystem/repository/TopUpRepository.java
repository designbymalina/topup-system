package pl.dbm.topupsystem.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.dbm.topupsystem.entity.TopUp;

public interface TopUpRepository extends JpaRepository<TopUp, Long> {
  List<TopUp> findBySimCardIdOrderByCreatedAtDesc(Long simCardId);

  @Query(
      """
    select coalesce(sum(t.amount), 0)
    from TopUp t
    where t.createdAt >= :start and t.createdAt < :end
    """)
  BigDecimal sumAmountBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  long countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(LocalDateTime start, LocalDateTime end);
}
