/**
 * Project: Prepaid Top-Up & Billing System
 *
 * @author Design by Malina
 */
package pl.dbm.topupsystem.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.dbm.topupsystem.dto.SimCardRequest;
import pl.dbm.topupsystem.entity.Customer;
import pl.dbm.topupsystem.entity.SimCard;
import pl.dbm.topupsystem.enums.SimCardStatus;
import pl.dbm.topupsystem.service.CustomerService;
import pl.dbm.topupsystem.service.SimCardService;

@RestController
public class SimCardController {
  private final SimCardService simCardService;
  private final CustomerService customerService;

  public SimCardController(SimCardService simCardService, CustomerService customerService) {
    this.simCardService = simCardService;
    this.customerService = customerService;
  }

  @GetMapping("/api/sim-cards")
  public Page<SimCard> findAll(
      @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
    return simCardService.findAll(pageable);
  }

  @PostMapping("/api/sim-cards")
  public SimCard save(@Valid @RequestBody SimCardRequest request) {
    SimCard simCard = new SimCard();

    simCard.setPhoneNumber(request.getPhoneNumber());
    simCard.setStatus(SimCardStatus.valueOf(request.getStatus()));
    simCard.setBalance(request.getBalance());
    simCard.setValidUntil(request.getValidUntil());

    Customer customer = null;

    if (request.getCustomerId() != null) {
      customer = customerService.findById(request.getCustomerId());
    }

    simCard.setCustomer(customer);

    return simCardService.save(simCard);
  }

  @PutMapping("/api/sim-cards/{id}")
  public SimCard update(@PathVariable Long id, @Valid @RequestBody SimCardRequest request) {
    SimCard simCard = new SimCard();

    simCard.setPhoneNumber(request.getPhoneNumber());
    simCard.setStatus(SimCardStatus.valueOf(request.getStatus()));
    simCard.setBalance(request.getBalance());
    simCard.setValidUntil(request.getValidUntil());

    Customer customer = null;

    if (request.getCustomerId() != null) {
      customer = customerService.findById(request.getCustomerId());
    }

    simCard.setCustomer(customer);

    return simCardService.update(id, simCard);
  }

  @DeleteMapping("/api/sim-cards/{id}")
  public void delete(@PathVariable Long id) {
    simCardService.delete(id);
  }
}
