package pl.dbm.topupsystem.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.enums.SimCardStatus;
import pl.dbm.topupsystem.service.CustomerService;
import pl.dbm.topupsystem.service.SimCardService;

@WithMockUser(roles = "ADMIN")
@WebMvcTest(SimCardController.class)
class SimCardControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private SimCardService simCardService;

  @MockitoBean private CustomerService customerService;

  @Test
  void shouldReturnAllSimCards() throws Exception {
    List<SimCard> simCards = List.of(new SimCard(), new SimCard());

    when(simCardService.findAll()).thenReturn(simCards);

    mockMvc
        .perform(get("/api/sim-cards"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(2)));
  }

  @Test
  void shouldCreateSimCard() throws Exception {
    SimCard simCard = new SimCard();

    simCard.setPhoneNumber("+48501234567");
    simCard.setStatus(SimCardStatus.ACTIVE);
    simCard.setBalance(new BigDecimal("50.00"));
    simCard.setValidUntil(LocalDate.of(2026, 12, 31));

    when(simCardService.save(any(SimCard.class))).thenReturn(simCard);

    mockMvc
        .perform(
            post("/api/sim-cards")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                    "phoneNumber": "+48501234567",
                    "status": "ACTIVE",
                    "balance": 50.00,
                    "validUntil": "2026-12-31"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.phoneNumber").value("+48501234567"))
        .andExpect(jsonPath("$.status").value("ACTIVE"))
        .andExpect(jsonPath("$.balance").value(50.00))
        .andExpect(jsonPath("$.validUntil").value("2026-12-31"));
  }

  @Test
  void shouldRejectInvalidSimCard() throws Exception {
    mockMvc
        .perform(
            post("/api/sim-cards")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                    "phoneNumber": "501234567",
                    "status": "INVALID",
                    "balance": -10.00,
                    "validUntil": "2020-01-01"
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(
            jsonPath("$.errors.phoneNumber")
                .value("Numer telefonu musi być w formacie międzynarodowym, np. +48123456789"))
        .andExpect(
            jsonPath("$.errors.status")
                .value("Status musi przyjmować wartość ACTIVE, BLOCKED lub DEACTIVATED"))
        .andExpect(jsonPath("$.errors.balance").value("Saldo nie może być ujemne"))
        .andExpect(
            jsonPath("$.errors.validUntil")
                .value("Data ważności nie może przypadać w przeszłości"));

    verify(simCardService, never()).save(any(SimCard.class));
  }

  @Test
  void shouldUpdateSimCard() throws Exception {
    SimCard simCard = new SimCard();

    simCard.setPhoneNumber("+48501234567");
    simCard.setStatus(SimCardStatus.ACTIVE);
    simCard.setBalance(new BigDecimal("100.00"));
    simCard.setValidUntil(LocalDate.of(2027, 1, 31));

    when(simCardService.update(eq(1L), any(SimCard.class))).thenReturn(simCard);

    mockMvc
        .perform(
            put("/api/sim-cards/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                    "phoneNumber": "+48501234567",
                    "status": "ACTIVE",
                    "balance": 100.00,
                    "validUntil": "2027-01-31"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.phoneNumber").value("+48501234567"))
        .andExpect(jsonPath("$.status").value("ACTIVE"))
        .andExpect(jsonPath("$.balance").value(100.00))
        .andExpect(jsonPath("$.validUntil").value("2027-01-31"));

    verify(simCardService).update(eq(1L), any(SimCard.class));
  }

  @Test
  void shouldDeleteSimCard() throws Exception {
    mockMvc.perform(delete("/api/sim-cards/1")).andExpect(status().isOk());

    verify(simCardService).delete(1L);
  }
}
