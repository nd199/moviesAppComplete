package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerStatsDTO;
import com.naren.moviesapp.Dto.ProductDTO;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Record.ProductCreateRequest;
import com.naren.moviesapp.Record.ProductUpdateRequest;
import com.naren.moviesapp.Service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
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
        customerService.addRole(role);
        return ResponseEntity.ok().body("Role added successfully");
    }
    @GetMapping("/customers/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable("id") Long customerId) {
        CustomerDTO customerDTO = customerService.getCustomerById(customerId);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/currentUser")
    public ResponseEntity<?> getCustomerByEmail(@AuthenticationPrincipal UserDetails userDetails) {
        CustomerDTO customerDTO = customerService.getCustomerByEmail(userDetails.getUsername());
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/currentAdmin/{email}")
    public ResponseEntity<?> getAdminByEmail(@PathVariable("email") String email) {
        CustomerDTO customerDTO = customerService.getCustomerByEmail(email);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers/byPhone")
    public ResponseEntity<CustomerDTO> getCustomerByPhoneNumber(@RequestParam String phoneNumber) {
        CustomerDTO customerDTO = customerService.getCustomerByPhoneNumber(Long.parseLong(phoneNumber.substring(1)));
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDTO>> customerList(@RequestParam(name = "new", required = false) Boolean isNew) {
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
        CustomerDTO updatedCustomer = customerService.updateCustomer(customer, customerId);
        return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable("id") Long customerId) {
        customerService.deleteCustomer(customerId);
    }

    @PutMapping("/customers/add-movie/{customerId}/{movieId}")
    public void addMovieToCustomer(@PathVariable Long customerId, @PathVariable Long movieId) {
        customerService.addMovieToCustomer(customerId, movieId);
    }

    @DeleteMapping("/customers/remove-movie/{customerId}/{movieId}")
    public void removeMovieFromCustomer(@PathVariable Long customerId, @PathVariable Long movieId) {
        customerService.removeMovieFromCustomer(customerId, movieId);
    }

    @DeleteMapping("/customers/{customerId}/remove-all-movies")
    public void removeAllMovies(@PathVariable Long customerId) {
        customerService.removeAllMovies(customerId);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        List<Role> roles = customerService.getRoles();
        return ResponseEntity.ok(roles);
    }

    @DeleteMapping("/roles/{id}")
    public void deleteRole(@PathVariable("id") Long id) {
        customerService.removeRole(id);
    }

    @GetMapping("/customers/loggedIn/{isLoggedIn}")
    public List<Customer> loggedInCustomers(@PathVariable boolean isLoggedIn) {
        List<Customer> customers = customerService.getCustomersByIsLoggedIn(isLoggedIn);
        return customers;
    }

    @GetMapping("/customers/stats")
    public ResponseEntity<List<CustomerStatsDTO>> getCustomerStats() {
        try {
            List<CustomerStatsDTO> customerStats = customerService.getCustomerStats();
            return ResponseEntity.ok(customerStats);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve customer statistics", e);
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
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
}