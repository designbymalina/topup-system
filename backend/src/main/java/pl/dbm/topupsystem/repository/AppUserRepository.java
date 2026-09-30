package pl.dbm.topupsystem.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.dbm.topupsystem.entity.AppUser;
import pl.dbm.topupsystem.enums.AppRole;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
  Optional<AppUser> findByUsername(String username);

  boolean existsByRole(AppRole role);
}
