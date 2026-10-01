package pl.dbm.topupsystem.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.dbm.topupsystem.entity.Customer;
import pl.dbm.topupsystem.enums.AuditAction;
import pl.dbm.topupsystem.enums.AuditEntityType;
import pl.dbm.topupsystem.exception.CustomerHasSimCardsException;
import pl.dbm.topupsystem.repository.CustomerRepository;
import pl.dbm.topupsystem.repository.SimCardRepository;

@Service
public class CustomerService {

  private final CustomerRepository customerRepository;
  private final SimCardRepository simCardRepository;
  private final AuditLogService auditLogService;

  public CustomerService(
      CustomerRepository customerRepository,
      SimCardRepository simCardRepository,
      AuditLogService auditLogService) {
    this.customerRepository = customerRepository;
    this.simCardRepository = simCardRepository;
    this.auditLogService = auditLogService;
  }

  public List<Customer> findAll() {
    return customerRepository.findAll(Sort.by("id").descending());
  }

  public Customer findById(Long id) {
    return customerRepository.findById(id).orElseThrow();
  }

  @Transactional
  public Customer save(Customer customer) {
    Customer savedCustomer = customerRepository.save(customer);

    auditLogService.record(AuditAction.CREATE, AuditEntityType.CUSTOMER, savedCustomer.getId());

    return savedCustomer;
  }

  @Transactional
  public Customer update(Long id, Customer customer) {
    Customer existingCustomer = customerRepository.findById(id).orElseThrow();

    existingCustomer.setFirstName(customer.getFirstName());
    existingCustomer.setLastName(customer.getLastName());
    existingCustomer.setPesel(customer.getPesel());

    Customer updatedCustomer = customerRepository.save(existingCustomer);
    auditLogService.record(AuditAction.UPDATE, AuditEntityType.CUSTOMER, updatedCustomer.getId());

    return updatedCustomer;
  }

  @Transactional
  public void delete(Long id) {
    Customer customer = customerRepository.findById(id).orElseThrow();

    if (simCardRepository.existsByCustomerId(id)) {
      throw new CustomerHasSimCardsException(
          "Nie można usunąć klienta, ponieważ jest przypisany do jednej lub więcej kart SIM.");
    }

    customerRepository.delete(customer);
    auditLogService.record(AuditAction.DELETE, AuditEntityType.CUSTOMER, id);
  }
}
