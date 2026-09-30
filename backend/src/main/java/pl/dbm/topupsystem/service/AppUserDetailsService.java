package pl.dbm.topupsystem.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.dbm.topupsystem.entity.AppUser;
import pl.dbm.topupsystem.repository.AppUserRepository;

@Service
public class AppUserDetailsService implements UserDetailsService {

  private final AppUserRepository appUserRepository;

  public AppUserDetailsService(AppUserRepository appUserRepository) {
    this.appUserRepository = appUserRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) {
    AppUser appUser =
        appUserRepository
            .findByUsername(username)
            .filter(AppUser::isEnabled)
            .orElseThrow(() -> new UsernameNotFoundException("Nieprawidłowy login lub hasło."));

    return User.withUsername(appUser.getUsername())
        .password(appUser.getPasswordHash())
        .authorities("ROLE_" + appUser.getRole().name())
        .build();
  }
}
