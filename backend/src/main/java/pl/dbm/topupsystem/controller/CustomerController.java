/**
 * Project: Prepaid Top-Up & Billing System
 *
 * @author Design by Malina
 */
package pl.dbm.topupsystem.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.dbm.topupsystem.dto.CustomerRequest;
import pl.dbm.topupsystem.entity.Customer;
import pl.dbm.topupsystem.service.CustomerService;

@RestController
public class CustomerController {
  private final CustomerService customerService;

  public CustomerController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @GetMapping("/api/customers")
  public List<Customer> findAll() {
    return customerService.findAll();
  }

  @PostMapping("/api/customers")
  public Customer save(@Valid @RequestBody CustomerRequest request) {
    Customer customer = new Customer();

    customer.setFirstName(request.getFirstName());
    customer.setLastName(request.getLastName());
    customer.setPesel(request.getPesel());

    return customerService.save(customer);
  }

  @PutMapping("/api/customers/{id}")
  public Customer update(@PathVariable Long id, @Valid @RequestBody CustomerRequest request) {
    Customer customer = new Customer();

    customer.setFirstName(request.getFirstName());
    customer.setLastName(request.getLastName());
    customer.setPesel(request.getPesel());

    return customerService.update(id, customer);
  }

  @DeleteMapping("/api/customers/{id}")
  public void delete(@PathVariable Long id) {
    customerService.delete(id);
  }
}
