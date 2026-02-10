package com.naren.moviesapp.Dao;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Repo.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CustomerDao {
    private final CustomerRepository customerRepository;

    public CustomerDao(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    
    public void addCustomer(Customer customer) {
        customerRepository.save(customer);
    }

    
    public Optional<Customer> getCustomer(Long customerId) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        return customer;
    }

    
    public void updateCustomer(Customer customer) {
        customerRepository.save(customer);
    }

    
    public boolean existsByEmail(String email) {
        boolean exists = customerRepository.existsByEmail(email);
        return exists;
    }

    
    public boolean existsByPhoneNumber(Long phoneNumber) {
        boolean exists = customerRepository.existsByPhoneNumber(phoneNumber);
        return exists;
    }

    
    public List<Customer> getCustomerList() {
        Page<Customer> page = customerRepository.findAll(PageRequest.of(0, 20));
        List<Customer> customers = page.getContent();
        return customers;
    }

    public Page<Customer> getCustomerList(int page, int size) {
        return customerRepository.findAll(PageRequest.of(page, size));
    }

    
    public void deleteCustomer(Customer customer) {
        customerRepository.delete(customer);
    }

    
    public Optional<Customer> getCustomerByUsername(String email) {
        return customerRepository.findCustomerByEmail(email);
    }

    
    public Optional<Customer> getCustomerByPhoneNumber(Long phoneNumber) {
        return customerRepository.getCustomerByPhoneNumber(phoneNumber);
    }

    
    public List<Customer> getCustomersByIsLoggedIn(Boolean isLoggedIn) {
        return customerRepository.getCustomersByIsLogged(isLoggedIn);
    }

    
    public List<Customer> getTop5Customers() {
        return customerRepository.getCustomersByTop5();
    }

    
    public List<Object[]> getCustomerStats() {
        return customerRepository.getCustomerCountByEachMonthInYear();
    }

}
