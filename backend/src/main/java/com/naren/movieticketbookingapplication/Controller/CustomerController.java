package com.naren.movieticketbookingapplication.Controller;

import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Record.CustomerRegistration;
import com.naren.movieticketbookingapplication.Record.CustomerUpdateRequest;
import com.naren.movieticketbookingapplication.Service.CustomerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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

    @GetMapping("/customers/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable("id") Long customerId) {
        log.info("Fetching customer by ID: {}", customerId);
        CustomerDTO customerDTO = customerService.getCustomerById(customerId);
        log.info("Customer found: {}", customerDTO);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/email")
    public ResponseEntity<CustomerDTO> getCustomerByEmail(@RequestBody String email) {
        log.info("Fetching customer by email: {}", email);
        CustomerDTO customerDTO = customerService.getCustomerByEmail(email);
        log.info("Customer found : {}", customerDTO);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }


    @GetMapping("/customers/phone")
    public ResponseEntity<CustomerDTO> getCustomerByPhoneNumber(@RequestBody String phoneNumber) {
        log.info("Fetching customer by phoneNumber: {}", phoneNumber);
        CustomerDTO customerDTO = customerService.getCustomerByPhoneNumber(Long.parseLong(phoneNumber.substring(1)));
        log.info("Customer  found :  {} ", customerDTO);
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
        log.info("Customer updated successfully with ID: {}", customerId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable("id") Long customerId) {
        log.info("Deleting customer with ID: {}", customerId);
        customerService.deleteCustomer(customerId);
        log.info("Customer deleted successfully with ID: {}", customerId);
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
        log.info("Fetching all roles");
        List<Role> roles = customerService.getRoles();
        log.info("Fetched {} roles", roles.size());
        return ResponseEntity.ok(roles);
    }

    @DeleteMapping("/roles/{id}")
    public void deleteRole(@PathVariable("id") Long id) {
        log.info("Deleting role with ID: {}", id);
        customerService.removeRole(id);
        log.info("Role deleted successfully with ID: {}", id);
    }

    @GetMapping("/customers/{isLoggedIn}")
    public List<Customer> loggedInCustomers(@PathVariable boolean isLoggedIn) {
        log.info("Fetching customers with loggedIn status: {}", isLoggedIn);
        List<Customer> customers = customerService.getCustomersByIsLoggedIn(isLoggedIn);
        log.info("Fetched {} customers with loggedIn status: {}", customers.size(), isLoggedIn);
        return customers;
    }

    @PutMapping("/customers/reset-pass/{id}")
    public void resetPassword(@PathVariable Long id,
                              @RequestBody Map<String, String> payload) {
        log.info("Resetting password for customer ID: {}", id);
        customerService.updatePassword(id, payload.get("resetPassword"),
                payload.get("typeOfVerification"),
                payload.get("enteredOtp")
        );
        log.info("Password reset successfully for customer ID: {}", id);
    }
}
