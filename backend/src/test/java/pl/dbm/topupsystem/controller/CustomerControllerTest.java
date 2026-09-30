package pl.dbm.topupsystem.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pl.dbm.topupsystem.entity.Customer;
import pl.dbm.topupsystem.service.CustomerService;

@WithMockUser(roles = "ADMIN")
@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private CustomerService customerService;

  @Test
  void shouldReturnAllCustomers() throws Exception {
    Customer customer1 = new Customer();
    customer1.setFirstName("Jan");
    customer1.setLastName("Kowalski");
    customer1.setPesel("80010112345");

    Customer customer2 = new Customer();
    customer2.setFirstName("Anna");
    customer2.setLastName("Nowak");
    customer2.setPesel("90020254321");

    when(customerService.findAll()).thenReturn(List.of(customer1, customer2));

    mockMvc
        .perform(get("/api/customers"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].firstName").value("Jan"))
        .andExpect(jsonPath("$[0].lastName").value("Kowalski"))
        .andExpect(jsonPath("$[0].pesel").value("80010112345"))
        .andExpect(jsonPath("$[1].firstName").value("Anna"))
        .andExpect(jsonPath("$[1].lastName").value("Nowak"))
        .andExpect(jsonPath("$[1].pesel").value("90020254321"));

    verify(customerService).findAll();
  }

  @Test
  void shouldCreateCustomer() throws Exception {
    Customer customer = new Customer();
    customer.setFirstName("Jan");
    customer.setLastName("Kowalski");
    customer.setPesel("80010112345");

    when(customerService.save(any(Customer.class))).thenReturn(customer);

    String request =
        """
                {
                    "firstName": "Jan",
                    "lastName": "Kowalski",
                    "pesel": "80010112345"
                }
                """;

    mockMvc
        .perform(post("/api/customers").contentType(APPLICATION_JSON).content(request))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.firstName").value("Jan"))
        .andExpect(jsonPath("$.lastName").value("Kowalski"))
        .andExpect(jsonPath("$.pesel").value("80010112345"));

    verify(customerService).save(any(Customer.class));
  }

  @Test
  void shouldRejectInvalidCustomer() throws Exception {
    String request =
        """
                {
                    "firstName": "",
                    "lastName": "",
                    "pesel": "123"
                }
                """;

    mockMvc
        .perform(post("/api/customers").contentType(APPLICATION_JSON).content(request))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(jsonPath("$.errors.firstName").value("Imię jest wymagane"))
        .andExpect(jsonPath("$.errors.lastName").value("Nazwisko jest wymagane"))
        .andExpect(
            jsonPath("$.errors.pesel").value("Numer PESEL musi składać się dokładnie z 11 cyfr"));

    verify(customerService, never()).save(any(Customer.class));
  }

  @Test
  void shouldUpdateCustomer() throws Exception {
    Customer customer = new Customer();
    customer.setFirstName("Jan");
    customer.setLastName("Nowak");
    customer.setPesel("80010112345");

    when(customerService.update(eq(1L), any(Customer.class))).thenReturn(customer);

    String request =
        """
                {
                    "firstName": "Jan",
                    "lastName": "Nowak",
                    "pesel": "80010112345"
                }
                """;

    mockMvc
        .perform(put("/api/customers/1").contentType(APPLICATION_JSON).content(request))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.firstName").value("Jan"))
        .andExpect(jsonPath("$.lastName").value("Nowak"))
        .andExpect(jsonPath("$.pesel").value("80010112345"));

    verify(customerService).update(eq(1L), any(Customer.class));
  }

  @Test
  void shouldDeleteCustomer() throws Exception {
    mockMvc.perform(delete("/api/customers/1")).andExpect(status().isOk());

    verify(customerService).delete(1L);
  }
}
