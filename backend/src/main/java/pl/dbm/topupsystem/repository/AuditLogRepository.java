package pl.dbm.topupsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.dbm.topupsystem.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}
