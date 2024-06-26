package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Record.CustomerRegistration;
import com.naren.movieticketbookingapplication.Record.CustomerUpdateRequest;
import com.naren.movieticketbookingapplication.Record.UserLogin;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;


public interface CustomerService {

    CustomerDTO getCustomerById(Long customerId);

    void updateCustomer(CustomerUpdateRequest customer, Long customerId);

    List<CustomerDTO> getAllCustomers();

    void deleteCustomer(Long customerId);

    void addMovieToCustomer(Long customerId, Long movieId);

    void removeMovieFromCustomer(Long customerId, Long movieId);

    ResponseEntity<?> registerUser(CustomerRegistration customerRegistration, Set<String> roleAdmin);

    void addRole(Role role);

    List<Role> getRoles();

    Role getRoleById(Long id);

    void removeRole(Long id);

    Customer loginUser(UserLogin userLogin, HttpServletRequest request);

    void removeAllMovies(Long customerId);
}
