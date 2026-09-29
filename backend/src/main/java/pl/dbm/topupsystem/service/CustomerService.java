package pl.dbm.topupsystem.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.dbm.topupsystem.entity.Customer;
import pl.dbm.topupsystem.repository.CustomerRepository;

@Service
public class CustomerService {

  private final CustomerRepository customerRepository;

  public CustomerService(CustomerRepository customerRepository) {
    this.customerRepository = customerRepository;
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

    customerRepository.delete(customer);
  }
}
