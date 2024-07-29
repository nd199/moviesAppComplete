package com.naren.movieticketbookingapplication.Controller;

import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Dto.CustomerStatsDTO;
import com.naren.movieticketbookingapplication.Dto.ProductDTO;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Record.CustomerUpdateRequest;
import com.naren.movieticketbookingapplication.Record.ProductCreateRequest;
import com.naren.movieticketbookingapplication.Record.ProductUpdateRequest;
import com.naren.movieticketbookingapplication.Service.CustomerService;
import com.naren.movieticketbookingapplication.Service.MovieService;
import com.naren.movieticketbookingapplication.Service.ProductService;
import com.naren.movieticketbookingapplication.Service.ShowService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class CustomerController {

    private final CustomerService customerService;
    private final MovieService movieService;
    private final ShowService showService;
    private final ProductService productService;

    public CustomerController(CustomerService customerService, MovieService movieService, ShowService showService, ProductService productService) {
        this.customerService = customerService;
        this.movieService = movieService;
        this.showService = showService;
        this.productService = productService;
    }

    @PostMapping("/roles")
    public ResponseEntity<?> addRoleToDb(@RequestBody Role role) {
        log.info("Received request to add role: {}", role);
        customerService.addRole(role);
        log.info("Role added successfully: {}", role);
        return ResponseEntity.ok().body("Role added successfully");
    }


    @GetMapping("/customers/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable("id") Long customerId) {
        log.info("Fetching customer by ID: {}", customerId);
        CustomerDTO customerDTO = customerService.getCustomerById(customerId);
        log.info("Customer found: {}", customerDTO);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/currentUser/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable("email") String email) {
        log.info("Fetching customer by email: {}", email);
        CustomerDTO customerDTO = customerService.getCustomerByEmail(email);
        log.info("Customer _found:{}", customerDTO);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/currentAdmin/{email}")
    public ResponseEntity<?> getAdminByEmail(@PathVariable("email") String email) {
        log.info("Fetching admin by email: {}", email);
        CustomerDTO customerDTO = customerService.getCustomerByEmail(email);
        log.info("Admin _found:{}", customerDTO);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/byPhone")
    public ResponseEntity<CustomerDTO> getCustomerByPhoneNumber(@RequestParam String phoneNumber) {
        log.info("Fetching customer by phoneNumber: {}", phoneNumber);
        CustomerDTO customerDTO = customerService.getCustomerByPhoneNumber(Long.parseLong(phoneNumber.substring(1)));
        log.info("Customer found : {}", customerDTO);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDTO>> customerList(@RequestParam(name = "new", required = false) Boolean isNew) {
        log.info("Fetching list of customers...");
        List<CustomerDTO> customers;
        if (Boolean.TRUE.equals(isNew)) {
            customers = customerService.getLatestCustomerList();
        } else {
            customers = customerService.getAllCustomers();
        }
        log.info("Fetched {} customers.", customers.size());
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@RequestBody CustomerUpdateRequest customer,
                                                      @PathVariable("id") Long customerId) {
        log.info("Updating customer with ID: {}", customerId);
        CustomerDTO updatedCustomer = customerService.updateCustomer(customer, customerId);
        log.info("Customer updated successfully with ID: {}", customerId);
        return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
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

    @GetMapping("/customers/loggedIn/{isLoggedIn}")
    public List<Customer> loggedInCustomers(@PathVariable boolean isLoggedIn) {
        log.info("Fetching customers with loggedIn status: {}", isLoggedIn);
        List<Customer> customers = customerService.getCustomersByIsLoggedIn(isLoggedIn);
        log.info("Fetched {} customers with loggedIn status: {}", customers.size(), isLoggedIn);
        return customers;
    }

    @GetMapping("/customers/stats")
    public ResponseEntity<List<CustomerStatsDTO>> getCustomerStats() {
        try {
            List<CustomerStatsDTO> customerStats = customerService.getCustomerStats();
            return ResponseEntity.ok(customerStats);
        } catch (Exception e) {
            System.out.println("Error getting customer stats" + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/products/AllProducts")
    public ResponseEntity<ProductDTO> getProducts() {
        List<Movie> movies = movieService.getMovieList();
        List<Show> shows = showService.getShowList();
        ProductDTO productDTO = new ProductDTO(movies, shows);
        return ResponseEntity.ok(productDTO);
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody ProductCreateRequest productCreateRequest) {
        return productService.addProduct(productCreateRequest);
    }


    @PutMapping("/products/{id}/{type}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductUpdateRequest productUpdateRequest,
                                           @PathVariable("id") Long id,
                                           @PathVariable("type") String type) {

        return productService.updateProduct(productUpdateRequest, id, type);
    }

    @DeleteMapping("/products/{id}/{type}")
    public void DeleteProductHandler(@PathVariable("id") Long id, @PathVariable("type") String type) {
        productService.deleteProduct(id, type);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<CustomerDTO> updateProfile(@RequestBody CustomerUpdateRequest customerUpdateRequest,
                                                     @PathVariable("id") Long id) {
        CustomerDTO customerDTO = customerService.updateCustomer(customerUpdateRequest, id);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/userRequest")
    public ResponseEntity<List<CustomerDTO>> customers(@RequestParam(name = "new", required = false)
                                                       Boolean isNew) {
        List<CustomerDTO> customers;
        if (Boolean.TRUE.equals(isNew)) {
            customers = customerService.getLatestCustomerList();
        } else {
            customers = customerService.getAllCustomers();
        }
        log.info("Fetched {} customers .", customers.size());
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
}