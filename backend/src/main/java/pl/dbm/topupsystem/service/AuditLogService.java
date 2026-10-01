package pl.dbm.topupsystem.service;

import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.dbm.topupsystem.entity.AuditLog;
import pl.dbm.topupsystem.enums.AuditAction;
import pl.dbm.topupsystem.enums.AuditEntityType;
import pl.dbm.topupsystem.repository.AuditLogRepository;

@Service
public class AuditLogService {

  private final AuditLogRepository auditLogRepository;

  public AuditLogService(AuditLogRepository auditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  @Transactional
  public void record(AuditAction action, AuditEntityType entityType, Long entityId) {
    auditLogRepository.save(
        new AuditLog(resolveActor(), action, entityType, entityId, Instant.now()));
  }

  @Transactional(readOnly = true)
  public Page<AuditLog> findAll(Pageable pageable) {
    return auditLogRepository.findAll(pageable);
  }

  private String resolveActor() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
      return "SYSTEM";
    }

    if (authentication instanceof AnonymousAuthenticationToken) {
      return "PUBLIC";
    }

    return authentication.getName();
  }
}
