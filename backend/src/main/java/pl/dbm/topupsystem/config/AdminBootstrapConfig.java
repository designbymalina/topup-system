package pl.dbm.topupsystem.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import pl.dbm.topupsystem.entity.AppUser;
import pl.dbm.topupsystem.enums.AppRole;
import pl.dbm.topupsystem.repository.AppUserRepository;

@Configuration
public class AdminBootstrapConfig {

  @Bean
  ApplicationRunner createInitialAdmin(
      AppUserRepository userRepository,
      PasswordEncoder passwordEncoder,
      @Value("${app.bootstrap-admin.username:}") String username,
      @Value("${app.bootstrap-admin.password:}") String password) {

    return args -> {
      if (userRepository.existsByRole(AppRole.ADMIN)) {
        return;
      }

      if (!StringUtils.hasText(username) || !StringUtils.hasText(password)) {
        throw new IllegalStateException(
            "Brakuje APP_ADMIN_USERNAME lub APP_ADMIN_PASSWORD do utworzenia administratora.");
      }

      AppUser admin = new AppUser(username, passwordEncoder.encode(password), AppRole.ADMIN);

      userRepository.save(admin);
    };
  }
}
