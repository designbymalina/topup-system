package pl.dbm.topupsystem.controller;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private static final long TOKEN_LIFETIME_SECONDS = 1800;

  private final AuthenticationManager authenticationManager;
  private final JwtEncoder jwtEncoder;

  public AuthController(AuthenticationManager authenticationManager, JwtEncoder jwtEncoder) {
    this.authenticationManager = authenticationManager;
    this.jwtEncoder = jwtEncoder;
  }

  @PostMapping("/login")
  public LoginResponse login(@RequestBody LoginRequest request) {
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(request.username(), request.password()));

      Instant now = Instant.now();
      List<String> roles =
          authentication.getAuthorities().stream()
              .map(GrantedAuthority::getAuthority)
              .map(authority -> authority.replaceFirst("^ROLE_", ""))
              .toList();

      JwtClaimsSet claims =
          JwtClaimsSet.builder()
              .issuer("topup-system")
              .issuedAt(now)
              .expiresAt(now.plus(TOKEN_LIFETIME_SECONDS, ChronoUnit.SECONDS))
              .subject(authentication.getName())
              .claim("roles", roles)
              .build();

      JwsHeader headers = JwsHeader.with(MacAlgorithm.HS256).build();
      String token = jwtEncoder.encode(JwtEncoderParameters.from(headers, claims)).getTokenValue();

      return new LoginResponse(token, "Bearer", TOKEN_LIFETIME_SECONDS);
    } catch (org.springframework.security.core.AuthenticationException exception) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nieprawidłowy login lub hasło.");
    }
  }

  public record LoginRequest(String username, String password) {}

  public record LoginResponse(String accessToken, String tokenType, long expiresIn) {}
}
