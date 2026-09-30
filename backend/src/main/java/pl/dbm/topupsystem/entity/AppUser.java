package pl.dbm.topupsystem.entity;

import jakarta.persistence.*;
import pl.dbm.topupsystem.enums.AppRole;

@Entity
@Table(name = "app_user")
public class AppUser {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AppRole role;

  @Column(nullable = false)
  private boolean enabled = true;

  protected AppUser() {}

  public AppUser(String username, String passwordHash, AppRole role) {
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
    this.enabled = true;
  }

  public Long getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public AppRole getRole() {
    return role;
  }

  public boolean isEnabled() {
    return enabled;
  }
}
