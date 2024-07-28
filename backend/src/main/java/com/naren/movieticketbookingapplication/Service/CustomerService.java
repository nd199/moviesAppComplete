package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Dto.CustomerStatsDTO;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Record.CustomerRegistration;
import com.naren.movieticketbookingapplication.Record.CustomerSubscription;
import com.naren.movieticketbookingapplication.Record.CustomerUpdateRequest;
import com.naren.movieticketbookingapplication.Record.EmailVerificationRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;


public interface CustomerService {

    CustomerDTO getCustomerById(Long customerId);

    CustomerDTO updateCustomer(CustomerUpdateRequest customer, Long customerId);

    void updatePassword(String email, String newPassword);

    List<CustomerDTO> getAllCustomers();

    void deleteCustomer(Long customerId);

    void addMovieToCustomer(Long customerId, Long movieId);

    void removeMovieFromCustomer(Long customerId, Long movieId);

    ResponseEntity<?> registerUser(CustomerRegistration customerRegistration, Set<String> roleAdmin);

    void addRole(Role role);

    List<Role> getRoles();

    Role getRoleById(Long id);

    void removeRole(Long id);

    void removeAllMovies(Long customerId);

    List<Customer> getCustomersByIsLoggedIn(Boolean isLoggedIn);

    CustomerDTO getCustomerByEmail(String email);

    CustomerDTO getCustomerByPhoneNumber(Long phoneNumber);

    void generateAndSendMailOtp(EmailVerificationRequest email);

    List<CustomerDTO> getLatestCustomerList();

    List<CustomerStatsDTO> getCustomerStats();

    ResponseEntity<?> pingSubscription(CustomerSubscription customerSubscription);
}
