package pl.dbm.topupsystem.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.dbm.topupsystem.entity.Customer;
import pl.dbm.topupsystem.exception.CustomerHasSimCardsException;
import pl.dbm.topupsystem.repository.CustomerRepository;
import pl.dbm.topupsystem.repository.SimCardRepository;

@Service
public class CustomerService {

  private final CustomerRepository customerRepository;
  private final SimCardRepository simCardRepository;

  public CustomerService(
      CustomerRepository customerRepository, SimCardRepository simCardRepository) {
    this.customerRepository = customerRepository;
    this.simCardRepository = simCardRepository;
  }

  public List<Customer> findAll() {
    return customerRepository.findAll(Sort.by("id").descending());
  }

  public Customer findById(Long id) {
    return customerRepository.findById(id).orElseThrow();
  }

  public Customer save(Customer customer) {
    return customerRepository.save(customer);
  }

  public Customer update(Long id, Customer customer) {
    Customer existingCustomer = customerRepository.findById(id).orElseThrow();

    existingCustomer.setFirstName(customer.getFirstName());
    existingCustomer.setLastName(customer.getLastName());
    existingCustomer.setPesel(customer.getPesel());

    return customerRepository.save(existingCustomer);
  }

  public void delete(Long id) {
    Customer customer = customerRepository.findById(id).orElseThrow();

    if (simCardRepository.existsByCustomerId(id)) {
      throw new CustomerHasSimCardsException(
          "Nie można usunąć klienta, ponieważ jest przypisany do jednej lub więcej kart SIM.");
    }

    customerRepository.delete(customer);
  }
}
