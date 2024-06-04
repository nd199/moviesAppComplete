package com.naren.movieticketbookingapplication.Controller;

import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Record.CustomerRegistration;
import com.naren.movieticketbookingapplication.Record.CustomerUpdateRequest;
import com.naren.movieticketbookingapplication.Record.UserLogin;
import com.naren.movieticketbookingapplication.Service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/roles")
    public ResponseEntity<?> addRoleToDb(@RequestBody Role role) {
        log.info("Received request to add role: {}", role);
        customerService.addRole(role);
        log.info("Role added successfully: {}", role);
        return ResponseEntity
                .ok()
                .body("Role added successfully");
    }

    @PostMapping("/customers")
    public ResponseEntity<?> addCustomer(@RequestBody CustomerRegistration customerRegistration) {
        log.info("Received request to add customer: {}", customerRegistration);
        ResponseEntity<?> response = customerService.registerUser(customerRegistration, Set.of("ROLE_USER"));
        log.info("Customer registration response: {}", response);
        return response;
    }

    @PostMapping("/admins")
    public ResponseEntity<?> addAdmin(@RequestBody CustomerRegistration customerRegistration) {
        log.info("Received request to add admin: {}", customerRegistration);
        ResponseEntity<?> response = customerService.registerUser(customerRegistration, Set.of("ROLE_ADMIN"));
        log.info("Admin registration response: {}", response);
        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<Customer> login(@RequestBody UserLogin userLogin, HttpServletRequest request) {
        Customer response = customerService.loginUser(userLogin, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable("id") Long customerId) {
        log.info("Fetching customer by ID: {}", customerId);
        CustomerDTO customerDTO = customerService.getCustomerById(customerId);
        log.info("Customer found: {}", customerDTO);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDTO>> customerList() {
        log.info("Fetching list of customers...");
        List<CustomerDTO> customers = customerService.getAllCustomers();
        log.info("Fetched {} customers.", customers.size());
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<Customer> updateCustomer(@RequestBody CustomerUpdateRequest customer,
                                                   @PathVariable("id") Long customerId) {
        log.info("Updating customer with ID: {}", customerId);
        customerService.updateCustomer(customer, customerId);
        log.info("Customer updated successfully.");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable("id") Long customerId) {
        log.info("Deleting customer with ID: {}", customerId);
        customerService.deleteCustomer(customerId);
        log.info("Customer deleted successfully.");
    }

    @PutMapping("/customers/add-movie/{customerId}/{movieId}")
    public void addMovieToCustomer(@PathVariable Long customerId, @PathVariable Long movieId) {
        log.info("Adding movie with ID {} to customer with ID: {}", movieId, customerId);
        customerService.addMovieToCustomer(customerId, movieId);
        log.info("Movie with ID {} added to customer with ID: {}", movieId, customerId);
    }

    @DeleteMapping("/customers/remove-movie/{customerId}/{movieId}")
    public void removeMovieFromCustomer(@PathVariable Long customerId, @PathVariable Long movieId) {
        log.info("Removing movie with ID {} from customer with ID: {}", movieId, customerId);
        customerService.removeMovieFromCustomer(customerId, movieId);
        log.info("Movie with ID {} removed from customer with ID: {}", movieId, customerId);
    }


    @DeleteMapping("/customers/{customerId}/remove-all-movies")
    public void removeAllMovies(@PathVariable Long customerId) {
        log.info("Removing all movies from customer with ID: {}", customerId);
        customerService.removeAllMovies(customerId);
        log.info("All movies removed from customer with ID: {}", customerId);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        return ResponseEntity.ok(customerService.getRoles());
    }

    @DeleteMapping("/roles/{id}")
    public void deleteRole(@PathVariable("id") Long id) {
        customerService.removeRole(id);
    }
}