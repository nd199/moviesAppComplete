package com.naren.movieticketbookingapplication.Dao;

import com.naren.movieticketbookingapplication.Entity.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerDao {
    void addCustomer(Customer customer);

    Optional<Customer> getCustomer(Long customerId);

    void updateCustomer(Customer customer);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(Long phoneNumber);

    List<Customer> getCustomerList();

    void deleteCustomer(Customer customer);

    Optional<Customer> getCustomerByUsername(String email);

    Optional<Customer> getCustomerByPhoneNumber(Long phoneNumber);

    List<Customer> getCustomersByIsLoggedIn(Boolean isLoggedIn);

    List<Customer> getTop5Customers();

    List<Object[]> getCustomerStats();
}


