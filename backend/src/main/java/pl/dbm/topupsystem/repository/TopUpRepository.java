package pl.dbm.topupsystem.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.dbm.topupsystem.entity.TopUp;

public interface TopUpRepository extends JpaRepository<TopUp, Long> {
  List<TopUp> findBySimCardIdOrderByCreatedAtDesc(Long simCardId);
}
