package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerStatsDTO;
import com.naren.moviesapp.Dto.ProductDTO;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Record.ProductCreateRequest;
import com.naren.moviesapp.Record.ProductUpdateRequest;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.Service.MovieService;
import com.naren.moviesapp.Service.ProductService;
import com.naren.moviesapp.Service.ShowService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

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
        logger.info("Adding role to database: {}", role.getName());
        customerService.addRole(role);
        return ResponseEntity.ok().body("Role added successfully");
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable("id") Long customerId) {
        logger.debug("Fetching customer by ID: {}", customerId);
        CustomerDTO customerDTO = customerService.getCustomerById(customerId);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/currentUser")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        logger.info("getCurrentUser request received for user: {}", userDetails != null ? userDetails.getUsername() : "null");
        if (userDetails == null) {
            logger.warn("No authentication principal found - user not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        
        logger.debug("Fetching current user: {}", userDetails.getUsername());
        CustomerDTO customerDTO = customerService.getCustomerByEmail(userDetails.getUsername());
        logger.info("Successfully retrieved user: {} with roles: {}", customerDTO.email(), customerDTO.roles());
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/currentAdmin/{email}")
    public ResponseEntity<?> getAdminByEmail(@PathVariable("email") String email) {
        logger.debug("Fetching admin by email: {}", email);
        CustomerDTO customerDTO = customerService.getCustomerByEmail(email);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/byPhone")
    public ResponseEntity<CustomerDTO> getCustomerByPhoneNumber(@RequestParam String phoneNumber) {
        logger.debug("Fetching customer by phone number: {}", phoneNumber);
        CustomerDTO customerDTO = customerService.getCustomerByPhoneNumber(phoneNumber.substring(1));
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDTO>> customerList(@RequestParam(name = "new", required = false) Boolean isNew) {
        logger.debug("Fetching customer list, isNew: {}", isNew);
        List<CustomerDTO> customers;
        if (Boolean.TRUE.equals(isNew)) {
            customers = customerService.getLatestCustomerList();
        } else {
            customers = customerService.getAllCustomers();
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@RequestBody CustomerUpdateRequest customer,
                                                      @PathVariable("id") Long customerId) {
        logger.info("Updating customer with ID: {}", customerId);
        CustomerDTO updatedCustomer = customerService.updateCustomer(customer, customerId);
        return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable("id") Long customerId) {
        logger.info("Deleting customer with ID: {}", customerId);
        customerService.deleteCustomer(customerId);
    }

    @PutMapping("/customers/add-movie/{customerId}/{movieId}")
    public void addMovieToCustomer(@PathVariable Long customerId, @PathVariable Long movieId) {
        logger.info("Adding movie {} to customer {}", movieId, customerId);
        customerService.addMovieToCustomer(customerId, movieId);
    }

    @DeleteMapping("/customers/remove-movie/{customerId}/{movieId}")
    public void removeMovieFromCustomer(@PathVariable Long customerId, @PathVariable Long movieId) {
        logger.info("Removing movie {} from customer {}", movieId, customerId);
        customerService.removeMovieFromCustomer(customerId, movieId);
    }

    @DeleteMapping("/customers/{customerId}/remove-all-movies")
    public void removeAllMovies(@PathVariable Long customerId) {
        logger.info("Removing all movies for customer ID: {}", customerId);
        customerService.removeAllMovies(customerId);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        logger.debug("Fetching all roles");
        List<Role> roles = customerService.getRoles();
        return ResponseEntity.ok(roles);
    }

    @DeleteMapping("/roles/{id}")
    public void deleteRole(@PathVariable("id") Long id) {
        logger.info("Deleting role with ID: {}", id);
        customerService.removeRole(id);
    }

    @GetMapping("/customers/stats")
    public ResponseEntity<List<CustomerStatsDTO>> getCustomerStats() {
        logger.debug("Fetching customer statistics");
        try {
            List<CustomerStatsDTO> customerStats = customerService.getCustomerStats();
            return ResponseEntity.ok(customerStats);
        } catch (Exception e) {
            logger.error("Failed to retrieve customer statistics", e);
            throw new RuntimeException("Failed to retrieve customer statistics", e);
        }
    }

    @GetMapping("/products/AllProducts")
    public ResponseEntity<ProductDTO> getProducts() {
        logger.debug("Fetching all products (movies and shows)");
        List<Movie> movies = movieService.getMovieList();
        List<Show> shows = showService.getShowList();
        ProductDTO productDTO = new ProductDTO(movies, shows);
        return ResponseEntity.ok(productDTO);
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody ProductCreateRequest productCreateRequest) {
        logger.info("Adding new product");
        return productService.addProduct(productCreateRequest);
    }

    @PutMapping("/products/{id}/{type}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductUpdateRequest productUpdateRequest,
                                           @PathVariable("id") Long id,
                                           @PathVariable("type") String type) {
        logger.info("Updating product with ID: {} and type: {}", id, type);
        return productService.updateProduct(productUpdateRequest, id, type);
    }

    @DeleteMapping("/products/{id}/{type}")
    public void DeleteProductHandler(@PathVariable("id") Long id, @PathVariable("type") String type) {
        logger.info("Deleting product with ID: {} and type: {}", id, type);
        productService.deleteProduct(id, type);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<CustomerDTO> updateProfile(@RequestBody CustomerUpdateRequest customerUpdateRequest,
                                                     @PathVariable("id") Long id) {
        logger.info("Updating profile for customer ID: {}", id);
        CustomerDTO customerDTO = customerService.updateCustomer(customerUpdateRequest, id);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/userRequest")
    public ResponseEntity<List<CustomerDTO>> customers(@RequestParam(name = "new", required = false)
                                                       Boolean isNew) {
        logger.debug("Fetching customer list (userRequest), isNew: {}", isNew);
        List<CustomerDTO> customers;
        if (Boolean.TRUE.equals(isNew)) {
            customers = customerService.getLatestCustomerList();
        } else {
            customers = customerService.getAllCustomers();
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
}
