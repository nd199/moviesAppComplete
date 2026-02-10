package com.naren.moviesapp.Service;

import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerStatsDTO;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Record.CustomerRegistration;
import com.naren.moviesapp.Record.CustomerSubscription;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Record.EmailVerificationRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface CustomerServiceInterface {
    void addRole(Role role);
    List<Role> getRoles();
    Role getRoleById(Long id);
    void removeRole(Long id);
    ResponseEntity<?> registerUser(CustomerRegistration customerRegistration, Set<String> roleNames);
    CustomerDTO getCustomerById(Long customerId);
    CustomerDTO updateCustomer(CustomerUpdateRequest request, Long id);
    void updatePassword(String email, String newPassword);
    List<CustomerDTO> getAllCustomers();
    void deleteCustomer(Long customerId);
    void addMovieToCustomer(Long customerId, Long movieId);
    void removeMovieFromCustomer(Long customerId, Long movieId);
    void removeAllMovies(Long customerId);
    List<Customer> getCustomersByIsLoggedIn(Boolean isLoggedIn);
    CustomerDTO getCustomerByEmail(String email);
    CustomerDTO getCustomerByPhoneNumber(Long phoneNumber);
    void generateAndSendMailOtp(EmailVerificationRequest emailVerificationRequest);
    List<CustomerDTO> getLatestCustomerList();
    List<CustomerStatsDTO> getCustomerStats();
    ResponseEntity<?> pingSubscription(CustomerSubscription customerSubscription);
}
