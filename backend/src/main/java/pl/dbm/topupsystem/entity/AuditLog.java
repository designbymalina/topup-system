package pl.dbm.topupsystem.entity;

import jakarta.persistence.*;
import java.time.Instant;
import pl.dbm.topupsystem.enums.AuditAction;
import pl.dbm.topupsystem.enums.AuditEntityType;

@Entity
@Table(name = "audit_log")
public class AuditLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String actor;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private AuditAction action;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private AuditEntityType entityType;

  @Column(nullable = false)
  private Long entityId;

  @Column(nullable = false)
  private Instant occurredAt;

  protected AuditLog() {}

  public AuditLog(
      String actor,
      AuditAction action,
      AuditEntityType entityType,
      Long entityId,
      Instant occurredAt) {
    this.actor = actor;
    this.action = action;
    this.entityType = entityType;
    this.entityId = entityId;
    this.occurredAt = occurredAt;
  }

  public Long getId() {
    return id;
  }

  public String getActor() {
    return actor;
  }

  public AuditAction getAction() {
    return action;
  }

  public AuditEntityType getEntityType() {
    return entityType;
  }

  public Long getEntityId() {
    return entityId;
  }

  public Instant getOccurredAt() {
    return occurredAt;
  }
}
