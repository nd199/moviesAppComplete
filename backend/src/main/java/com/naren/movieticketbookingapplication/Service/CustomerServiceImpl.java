package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Dao.CustomerDao;
import com.naren.movieticketbookingapplication.Dao.MovieDao;
import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Dto.CustomerDTOMapper;
import com.naren.movieticketbookingapplication.Dto.CustomerStatsDTO;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Exception.*;
import com.naren.movieticketbookingapplication.Record.CustomerRegistration;
import com.naren.movieticketbookingapplication.Record.CustomerUpdateRequest;
import com.naren.movieticketbookingapplication.Record.EmailVerificationRequest;
import com.naren.movieticketbookingapplication.Utils.OtpService;
import com.naren.movieticketbookingapplication.jwt.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Transactional
@Service
public class CustomerServiceImpl implements CustomerService {

    private static final long REQ_PASSWORD_LENGTH = 8;
    private final CustomerDao customerDao;
    private final PasswordEncoder passwordEncoder;
    private final CustomerDTOMapper customerDTOMapper;
    private final RoleService roleService;
    private final MovieDao movieDao;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public CustomerServiceImpl(CustomerDao customerDao, PasswordEncoder passwordEncoder, CustomerDTOMapper customerDTOMapper, RoleService roleService, MovieDao movieDao, JwtUtil jwtUtil, OtpService otpService) {
        this.customerDao = customerDao;
        this.passwordEncoder = passwordEncoder;
        this.customerDTOMapper = customerDTOMapper;
        this.roleService = roleService;
        this.movieDao = movieDao;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
    }

    @Override
    public void addRole(Role role) {
        if (role == null) {
            log.error("Role cannot be null");
            throw new ResourceNotFoundException("Role cannot be null");
        }
        if (roleService.existsByName(role)) {
            log.error("Role already exists: {}", role.getName());
            throw new ResourceAlreadyExists("Role already exists");
        }
        roleService.saveRole(role);
        log.info("Role added successfully: {}", role.getName());
    }

    @Override
    public List<Role> getRoles() {
        log.info("Fetching all roles");
        return roleService.getAllRoles();
    }

    @Override
    public Role getRoleById(Long id) {
        log.info("Fetching role by ID: {}", id);
        return roleService.findRoleById(id);
    }

    @Override
    public void removeRole(Long id) {
        log.info("Removing role with ID: {}", id);
        Role role = getRoleById(id);
        if (role == null) {
            log.error("Role not found with ID: {}", id);
            throw new ResourceNotFoundException("Role not found");
        }
        roleService.deleteRole(id);
        log.info("Role removed successfully with ID: {}", id);
    }


    @Override
    public ResponseEntity<?> registerUser(CustomerRegistration customerRegistration, Set<String> roleNames) {
        log.info("Registering new user: {}", customerRegistration);

        try {
            Customer registeredCustomer = registerCustomer(customerRegistration);
            Set<Role> roles = new HashSet<>();

            for (String roleName : roleNames) {
                Role role = roleService.findRoleByName(roleName);
                if (role == null) {
                    log.error("Role not found: {}", roleName);
                    return ResponseEntity.badRequest().body("Role " + roleName + " not found");
                }
                roles.add(role);
            }

            roles.forEach(registeredCustomer::addRole);
            registeredCustomer.setIsEmailVerified(true);
            registeredCustomer.setIsLogged(true);
            customerDao.addCustomer(registeredCustomer);

            String token = jwtUtil.issueToken(registeredCustomer.getUsername(), roles);

            log.info("User registered successfully: {}", customerRegistration.email());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .header(HttpHeaders.AUTHORIZATION, token)
                    .body("Customer registered successfully!");
        } catch (InvalidRegistration e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Customer registerCustomer(CustomerRegistration customerRegistration) {
        log.info("Validating and registering customer: {}", customerRegistration.email());

        boolean isValidPassword = validatePassword(customerRegistration.password(), customerRegistration.name(), customerRegistration.email(), customerRegistration.phoneNumber());
        if (!isValidPassword) {
            log.error("Invalid password for user: {}", customerRegistration.email());
            throw new PasswordInvalidException("Invalid password");
        }
        if (customerDao.existsByEmail(customerRegistration.email())) {
            log.error("Email already taken: {}", customerRegistration.email());
            throw new ResourceAlreadyExists("Email already taken");
        }
        if (customerDao.existsByPhoneNumber(customerRegistration.phoneNumber())) {
            log.error("Phone number already taken: {}", customerRegistration.phoneNumber());
            throw new ResourceAlreadyExists("Phone number already taken");
        }
        return new Customer(customerRegistration.name(),
                customerRegistration.email().toLowerCase(),
                passwordEncoder.encode(customerRegistration.password()),
                customerRegistration.phoneNumber(),
                false, false, "Chennai, India");
    }

    private boolean validatePassword(String password, String name, String email, Long phoneNumber) {
        if (password == null || password.length() < REQ_PASSWORD_LENGTH) {
            log.error("Password must be at least {} characters long", REQ_PASSWORD_LENGTH);
            throw new PasswordInvalidException("Password must be at least %s characters long".formatted(REQ_PASSWORD_LENGTH));
        }
        return !containsPersonalInfo(password, name, email, phoneNumber);
    }

    private boolean containsPersonalInfo(String password, String name, String email, Long phoneNumber) {

        if (password.contains(name) || password.contains(email) || password.contains(String.valueOf(phoneNumber))) {
            throw new PasswordInvalidException("Password must not contain personal info [Name,Email,Phone] ");
        }
        return false;
    }

    @Override
    public CustomerDTO getCustomerById(Long customerId) {
        log.info("Fetching customer by ID: {}", customerId);
        return customerDao.getCustomer(customerId)
                .map(customerDTOMapper)
                .orElseThrow(() -> {
                    log.error("Customer not found with ID : {}", customerId);
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });
    }

    @Override
    public CustomerDTO updateCustomer(CustomerUpdateRequest request, Long id) {
        log.info("Updating customer with ID: {}", id);

        Customer customer = customerDao.getCustomer(id)
                .orElseThrow(() -> {
                    log.error("Customer not found with ID  : {}", id);
                    return new ResourceNotFoundException("Customer with ID " + id + " not found");
                });

        boolean changes = false;
        System.out.println(request);

        if (request.name() != null && !request.name().equals(customer.getName())) {
            customer.setName(request.name());
            changes = true;
        }
        if (request.email() != null && !request.email().equals(customer.getEmail())) {
            if (customerDao.existsByEmail(request.email())) {
                log.error("Email already exists: {}", request.email());
                throw new ResourceAlreadyExists("Email already taken");
            }
            customer.setEmail(request.email());
            changes = true;
        }
        if (request.phoneNumber() != null && !request.phoneNumber().equals(customer.getPhoneNumber())) {
            customer.setPhoneNumber(request.phoneNumber());
            changes = true;
        }

        if (!changes) {
            log.warn("No data changes found for customer with ID: {}", id);
            throw new RequestValidationException("No data changes found");
        }

        customerDao.updateCustomer(customer);
        log.info("Customer updated successfully: {}", customer);

        return customerDTOMapper.apply(customer);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        log.info("Fetching all customers");
        List<CustomerDTO> customers = customerDao.getCustomerList()
                .stream()
                .map(customerDTOMapper)
                .toList();
        log.info("Retrieved {} customers", customers.size());
        return customers;
    }

    @Override
    public void deleteCustomer(Long customerId) {
        log.info("Deleting customer with ID: {}", customerId);

        Customer customer = customerDao.getCustomer(customerId)
                .orElseThrow(() -> {
                    log.error("Customer not found with  ID  :  {}", customerId);
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });

        if (!customer.getMovies().isEmpty()) {
            removeAllMovies(customerId);
        }
        customerDao.deleteCustomer(customer);
        log.info("Customer deleted successfully: {}", customer);
    }

    @Override
    public void addMovieToCustomer(Long customerId, Long movieId) {
        log.info("Adding movie with ID {} to customer with ID {}", movieId, customerId);

        Customer customer = customerDao.getCustomer(customerId)
                .orElseThrow(() -> {
                    log.error("Customer not found with  ID : {}  ", customerId);
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });
        Movie movie = movieDao.getMovieById(movieId)
                .orElseThrow(() -> {
                    log.error("Movie not found with  ID: {}", movieId);
                    return new ResourceNotFoundException("Movie with ID " + movieId + " not found");
                });

        if (customer.getMovies().contains(movie)) {
            log.error("Customer {} already subscribed to movie {}", customerId, movieId);
            throw new ResourceAlreadyExists(
                    "Customer " + customerId + " already subscribed to movie " + movieId);
        }
        customer.addMovie(movie);
        customerDao.updateCustomer(customer);

        log.info("Movie added to customer successfully: Customer={}, Movie={}", customer.getName(), movie.getName());
    }

    @Override
    public void removeMovieFromCustomer(Long customerId, Long movieId) {
        log.info("Removing movie with ID {} from customer with ID {}", movieId, customerId);

        Customer customer = customerDao.getCustomer(customerId)
                .orElseThrow(() -> {
                    log.error("Customer not  found with ID:  {}", customerId);
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });
        Movie movie = movieDao.getMovieById(movieId)
                .orElseThrow(() -> {
                    log.error("Movie not found with ID: {}", movieId);
                    return new ResourceNotFoundException("Movie with ID " + movieId + " not found");
                });

        if (!customer.getMovies().contains(movie)) {
            log.error("Customer {} not subscribed to movie {}", customerId, movieId);
            throw new ResourceNotFoundException(
                    "Customer " + customerId + " not subscribed to movie " + movieId);
        }
        customer.removeMovie(movie);
        customerDao.updateCustomer(customer);
        log.info("Movie removed from customer successfully: Customer={}, Movie={}", customer.getName(), movie.getName());
    }

    @Override
    public void removeAllMovies(Long customerId) {
        log.info("Removing all movies from customer with ID: {}", customerId);

        Customer customer = customerDao.getCustomer(customerId)
                .orElseThrow(() -> {
                    log.error("Customer not found with ID: {}", customerId);
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });

        List<Movie> movies = customer.getMovies();

        if (movies.isEmpty()) {
            log.warn("Customer with ID {} is not subscribed to any movie", customerId);
            throw new ResourceNotFoundException(
                    "Customer " + customerId + " not subscribed to any movie");
        }

        log.info("Removing all movies from customer: {}", customer.getName());
        customer.removeMovies(movies);
        customerDao.updateCustomer(customer);
        log.info("Movies removed from customer successfully: Customer={}", customer.getName());
    }

    @Override
    public List<Customer> getCustomersByIsLoggedIn(Boolean isLoggedIn) {
        log.info("Fetching customers that are logged in");
        List<Customer> customers = customerDao.getCustomersByIsLoggedIn(isLoggedIn);
        if (customers.isEmpty()) {
            log.warn("No customers logged in");
            throw new ResourceNotFoundException(
                    "No customers logged in");
        }
        return customers;
    }

    @Override
    public void updatePassword(Long customerID, String newPassword, String verificationType, String enteredOtp) {
        log.info("Updating password for customer with ID: {}", customerID);

        Customer customer = customerDao.getCustomer(customerID).orElseThrow(
                () -> {
                    log.error("Customer not found with  ID: {}", customerID);
                    return new ResourceNotFoundException("No Customer Found with id : " + customerID);
                }
        );

        if ("mobile".equalsIgnoreCase(verificationType)) {
            otpService.generateAndSendOtp(customerID, String.valueOf(customer.getPhoneNumber()), "mobile");
        } else if ("mail".equalsIgnoreCase(verificationType)) {
            otpService.generateAndSendOtp(customerID, String.valueOf(customer.getEmail()), "mail");
        } else {
            log.error("Invalid verification type: {}", verificationType);
            throw new IllegalArgumentException("Invalid verification type");
        }

        boolean isValidPassword = validatePassword(newPassword, customer.getName(), customer.getEmail(), customer.getPhoneNumber());

        if (!isValidPassword) {
            log.error("Invalid password: {}", newPassword);
            throw new PasswordInvalidException("Invalid password");
        }

        customer.setPassword(passwordEncoder.encode(newPassword));
        customerDao.updateCustomer(customer);

        log.info("Password updated successfully for customer with ID: {}", customerID);
        ResponseEntity.ok("Password reset successfully");
    }

    @Override
    public CustomerDTO getCustomerByEmail(String email) {
        return customerDao.getCustomerByUsername(email).map((customerDTOMapper))
                .orElseThrow(
                        () -> new ResourceNotFoundException("Could not find customer by email " + email)
                );
    }

    @Override
    public CustomerDTO getCustomerByPhoneNumber(Long phoneNumber) {
        return customerDao.getCustomerByPhoneNumber(phoneNumber)
                .map(customerDTOMapper).orElseThrow(
                        () -> new ResourceNotFoundException("Could not find customer by phone number " + phoneNumber)
                );
    }

    @Override
    public void generateAndSendMailOtp(EmailVerificationRequest emailVerificationRequest) {
        otpService.generateAndSendMailOtp(emailVerificationRequest.email());
    }

    @Override
    public List<CustomerDTO> getLatestCustomerList() {
        return customerDao.getTop5Customers()
                .stream().map(customerDTOMapper)
                .toList();
    }

    @Override
    public List<CustomerStatsDTO> getCustomerStats() {
        return customerDao.getCustomerStats()
                .stream()
                .map(result -> new CustomerStatsDTO(((Number) result[0]).intValue(),
                        ((Number) result[1]).longValue()))
                .toList();
    }
}
