package pl.dbm.topupsystem.config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pl.dbm.topupsystem.controller.AuthController;
import pl.dbm.topupsystem.controller.SimCardController;
import pl.dbm.topupsystem.controller.TopUpController;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.entity.TopUp;
import pl.dbm.topupsystem.service.CustomerService;
import pl.dbm.topupsystem.service.SimCardService;
import pl.dbm.topupsystem.service.TopUpService;

@WebMvcTest(controllers = {AuthController.class, SimCardController.class, TopUpController.class})
@Import({SecurityConfig.class, WebConfig.class})
class SecurityConfigTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private AuthenticationManager authenticationManager;

  @MockitoBean private JwtEncoder jwtEncoder;

  @MockitoBean private JwtDecoder jwtDecoder;

  @MockitoBean private SimCardService simCardService;

  @MockitoBean private CustomerService customerService;

  @MockitoBean private TopUpService topUpService;

  @Test
  void shouldRejectUnauthenticatedRequestToAdminApi() throws Exception {
    mockMvc.perform(get("/api/sim-cards")).andExpect(status().isUnauthorized());

    verify(simCardService, never()).findAll(any(Pageable.class));
  }

  @Test
  void shouldAllowAdminToAccessAdminApi() throws Exception {
    when(simCardService.findAll(any(Pageable.class))).thenReturn(Page.<SimCard>empty());

    mockMvc
        .perform(
            get("/api/sim-cards").with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
        .andExpect(status().isOk());
  }

  @Test
  void shouldForbidAuthenticatedUserWithoutAdminRole() throws Exception {
    mockMvc
        .perform(
            get("/api/sim-cards").with(jwt().jwt(token -> token.claim("roles", List.of("USER")))))
        .andExpect(status().isForbidden());

    verify(simCardService, never()).findAll(any(Pageable.class));
  }

  @Test
  void shouldRejectInvalidBearerToken() throws Exception {
    when(jwtDecoder.decode("bad-token")).thenThrow(new BadJwtException("Invalid JWT"));

    mockMvc
        .perform(get("/api/sim-cards").header("Authorization", "Bearer bad-token"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void shouldAllowPublicTopUpWithoutAuthentication() throws Exception {
    when(topUpService.createPublic("+48123456789", new BigDecimal("30.00")))
        .thenReturn(new TopUp());

    mockMvc
        .perform(
            post("/api/top-ups")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "phoneNumber": "+48123456789",
                      "amount": 30.00
                    }
                    """))
        .andExpect(status().isOk());

    verify(topUpService).createPublic("+48123456789", new BigDecimal("30.00"));
  }

  @Test
  void shouldReturnJwtAfterValidLogin() throws Exception {
    Authentication adminAuthentication =
        new UsernamePasswordAuthenticationToken(
            "Admin", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));

    when(authenticationManager.authenticate(any(Authentication.class)))
        .thenReturn(adminAuthentication);

    Instant now = Instant.now();
    Jwt encodedJwt =
        Jwt.withTokenValue("test-token")
            .header("alg", "HS256")
            .subject("Admin")
            .issuedAt(now)
            .expiresAt(now.plusSeconds(1800))
            .claim("roles", List.of("ADMIN"))
            .build();

    when(jwtEncoder.encode(any(JwtEncoderParameters.class))).thenReturn(encodedJwt);

    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "username": "Admin",
                      "password": "test-password"
                    }
                    """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").value("test-token"))
        .andExpect(jsonPath("$.tokenType").value("Bearer"))
        .andExpect(jsonPath("$.expiresIn").value(1800));
  }

  @Test
  void shouldRejectLoginWithInvalidCredentials() throws Exception {
    when(authenticationManager.authenticate(any(Authentication.class)))
        .thenThrow(new BadCredentialsException("Invalid credentials"));

    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "username": "Admin",
                      "password": "wrong-password"
                    }
                    """))
        .andExpect(status().isUnauthorized());
  }
}
