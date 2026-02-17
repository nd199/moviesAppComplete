package com.naren.moviesapp.Service;

import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.MovieRepository;
import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerDTOMapper;
import com.naren.moviesapp.Dto.CustomerStatsDTO;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Exception.*;
import com.naren.moviesapp.Record.CustomerRegistration;
import com.naren.moviesapp.Record.CustomerSubscription;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Record.EmailVerificationRequest;
import com.naren.moviesapp.Utils.OtpService;
import com.naren.moviesapp.jwt.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class CustomerService implements CustomerServiceInterface {
    private static final Logger logger = LoggerFactory.getLogger(CustomerService.class);
    private static final long REQ_PASSWORD_LENGTH = 8;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerDTOMapper customerDTOMapper;
    private final RoleService roleService;
    private final MovieRepository movieRepository;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public CustomerService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder,
                           CustomerDTOMapper customerDTOMapper, RoleService roleService,
                           MovieRepository movieRepository, JwtUtil jwtUtil, OtpService otpService) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerDTOMapper = customerDTOMapper;
        this.roleService = roleService;
        this.movieRepository = movieRepository;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public void addRole(Role role) {
        if (role == null) {
            throw new ResourceNotFoundException("Role cannot be null");
        }
        if (roleService.existsByName(role)) {
            throw new ResourceAlreadyExists("Role already exists");
        }
        roleService.saveRole(role);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<Role> getRoles() {
        return roleService.getAllRoles();
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public Role getRoleById(Long id) {
        return roleService.findRoleById(id);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public void removeRole(Long id) {
        Role role = getRoleById(id);
        if (role == null) {
            throw new ResourceNotFoundException("Role not found");
        }
        roleService.deleteRole(id);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Transactional
    public ResponseEntity<?> registerUser(CustomerRegistration customerRegistration, Set<String> roleNames) {

        logger.info("Attempting to register new user with email: {}", customerRegistration.email());

        try {
            Customer registeredCustomer = registerCustomer(customerRegistration);
            Set<Role> roles = new HashSet<>();

            for (String roleName : roleNames) {
                Role role = roleService.findRoleByName(RoleName.valueOf(roleName));
                if (role == null) {
                    logger.warn("Role not found during registration: {}", roleName);
                    throw new RoleNotFoundException("Role " + roleName + " not found");
                }
                roles.add(role);
                applyAdminDefaults(registeredCustomer, roles);
            }

            roles.forEach(registeredCustomer::addRole);
            registeredCustomer.setIsEmailVerified(true);
            registeredCustomer.setIsRegistered(true);
            registeredCustomer.setImageUrl(customerRegistration.imageUrl());
            customerRepository.save(registeredCustomer);

            String token = jwtUtil.issueToken(registeredCustomer.getUsername(), roles);
            CustomerDTO customerDTO = customerDTOMapper.apply(registeredCustomer);

            logger.info("Successfully registered user with email: {}, roles: {}",
                    customerRegistration.email(), roleNames);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .header(HttpHeaders.AUTHORIZATION, token)
                    .body(customerDTO);
        } catch (InvalidRegistration e) {
            logger.warn("Invalid registration attempt for email {}: {}",
                    customerRegistration.email(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RoleNotFoundException e) {
            logger.error("Role assignment failed for email {}: {}",
                    customerRegistration.email(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Customer registerCustomer(CustomerRegistration customerRegistration) {

        boolean isValidPassword = validatePassword(customerRegistration.password(), customerRegistration.name(), customerRegistration.email(), customerRegistration.phoneNumber());
        if (!isValidPassword) {
            throw new PasswordInvalidException("Invalid password");
        }
        if (customerRepository.existsByEmail(customerRegistration.email())) {
            throw new ResourceAlreadyExists("Email already taken");
        }
        if (customerRepository.existsByPhoneNumber(customerRegistration.phoneNumber())) {
            throw new ResourceAlreadyExists("Phone number already taken");
        }
        return new Customer(customerRegistration.name(),
                customerRegistration.email().toLowerCase(),
                passwordEncoder.encode(customerRegistration.password()),
                customerRegistration.phoneNumber(),
                false, false, false, customerRegistration.address(), false);
    }

    private boolean validatePassword(String password, String name, String email, String phoneNumber) {
        if (password == null || password.length() < REQ_PASSWORD_LENGTH) {
            throw new PasswordInvalidException("Password must be at least %s characters long".formatted(REQ_PASSWORD_LENGTH));
        }
        return !containsPersonalInfo(password, name, email, phoneNumber);
    }

    private boolean containsPersonalInfo(String password, String name, String email, String phoneNumber) {

        if (password.contains(name) ||
                password.contains(email) ||
                password.contains(phoneNumber)) {
            throw new PasswordInvalidException("Password must " +
                    "not contain personal info [Name,Email,Phone] ");
        }
        return false;
    }

    private void applyAdminDefaults(Customer registeredCustomer, Set<Role> roles) {
        if (roles.stream().anyMatch(role -> "ROLE_ADMIN".equals(role.getName()))) {
            registeredCustomer.setAddress("CN.io, Inc.");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public CustomerDTO getCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .map(customerDTOMapper)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Transactional
    public CustomerDTO updateCustomer(CustomerUpdateRequest request, Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Customer with ID " + id + " not found");
                });

        boolean changes = false;

        if (request.name() != null && !request.name().equals(customer.getName())) {
            customer.setName(request.name());
            changes = true;
        }
        if (request.email() != null && !request.email().equals(customer.getEmail())) {
            if (customerRepository.existsByEmail(request.email())) {
                throw new ResourceAlreadyExists("Email already taken");
            }
            customer.setEmail(request.email());
            changes = true;
        }
        if (request.phoneNumber() != null && !request.phoneNumber().equals(customer.getPhoneNumber())) {
            customer.setPhoneNumber(request.phoneNumber());
            changes = true;
        }
        if (request.address() != null && !request.address().equals(customer.getAddress())) {
            customer.setAddress(request.address());
            changes = true;
        }

        if (request.imageUrl() != null && !request.imageUrl().equals(customer.getImageUrl())) {
            customer.setImageUrl(request.imageUrl());
            changes = true;
        }

        if (request.isLogged() != null && !Objects.equals(request.isLogged(), customer.getIsLogged())) {
            customer.setIsLogged(request.isLogged());
            changes = true;
        }

        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }

        customerRepository.save(customer);

        return customerDTOMapper.apply(customer);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN') or #email == authentication.principal.username")
    @Transactional
    public void updatePassword(String email, String newPassword) {
        logger.info("Password update request for email: {}", email);

        Customer customer = customerRepository.findCustomerByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Password update failed - user not found: {}", email);
                    return new ResourceNotFoundException("Customer with email "
                            + email + " not found");
                });

        // Check if new password is same as current password by encoding the new password and comparing
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        if (passwordEncoder.matches(newPassword, customer.getPassword())) {
            logger.warn("Password update failed - new password same as current for email: {}", email);
            throw new PasswordInvalidException("New password cannot be the same as your current password");
        }

        var passwordIsValid = validatePassword(newPassword, customer.getName(), customer.getEmail(), customer.getPhoneNumber());
        if (!passwordIsValid) {
            logger.warn("Password update failed - validation error for email: {}", email);
            throw new PasswordInvalidException("Invalid password");
        }
        customer.setPassword(encodedNewPassword);
        customerRepository.save(customer);

        logger.info("Password successfully updated for email: {}", email);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<CustomerDTO> getAllCustomers() {
        List<CustomerDTO> customers = customerRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 20)).getContent()
                .stream()
                .map(customerDTOMapper)
                .toList();
        return customers;
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Transactional
    public void deleteCustomer(Long customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });

        if (!customer.getMovies().isEmpty()) {
            removeAllMovies(customerId);
        }
        customerRepository.delete(customer);
    }

    @Override
    public void addMovieToCustomer(Long customerId, Long movieId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Movie with ID " + movieId + " not found");
                });

        if (customer.getMovies().contains(movie)) {
            throw new ResourceAlreadyExists(
                    "Customer " + customerId + " already subscribed to movie " + movieId);
        }
        customer.addMovie(movie);
        customerRepository.save(customer);

    }

    @Override
    public void removeMovieFromCustomer(Long customerId, Long movieId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Movie with ID " + movieId + " not found");
                });

        if (!customer.getMovies().contains(movie)) {
            throw new ResourceNotFoundException(
                    "Customer " + customerId + " not subscribed to movie " + movieId);
        }
        customer.removeMovie(movie);
        customerRepository.save(customer);
    }

    @Override
    public void removeAllMovies(Long customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });

        List<Movie> movies = customer.getMovies();

        if (movies.isEmpty()) {
            throw new ResourceNotFoundException(
                    "Customer " + customerId + " not subscribed to any movie");
        }

        customer.removeMovies(movies);
        customerRepository.save(customer);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<Customer> getCustomersByIsLoggedIn(Boolean isLoggedIn) {
        List<Customer> customers = customerRepository.getCustomersByIsLogged(isLoggedIn);
        if (customers.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No customers logged in");
        }
        return customers;
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN') or #email == authentication.principal.username")
    public CustomerDTO getCustomerByEmail(String email) {
        return customerRepository.findCustomerByEmail(email).map((customerDTOMapper))
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Could not find customer by email " + email)
                );
    }

    @Override
    public CustomerDTO getCustomerByPhoneNumber(String phoneNumber) {
        return customerRepository.getCustomerByPhoneNumber(phoneNumber)
                .map(customerDTOMapper).orElseThrow(
                        () -> new ResourceNotFoundException("Could not find customer by phone number " + phoneNumber)
                );
    }

    @Override
    public void generateAndSendMailOtp(EmailVerificationRequest emailVerificationRequest) {
        otpService.generateAndSendMailOtp(emailVerificationRequest.email());
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<CustomerDTO> getLatestCustomerList() {
        return customerRepository.getCustomersByTop5()
                .stream().map(customerDTOMapper)
                .toList();
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<CustomerStatsDTO> getCustomerStats() {
        return customerRepository.getCustomerCountByEachMonthInYear()
                .stream()
                .map(result -> new CustomerStatsDTO(((Number) result[0]).intValue(),
                        ((Number) result[1]).longValue()))
                .toList();
    }

    @Override
    public ResponseEntity<?> pingSubscription(CustomerSubscription customerSubscription) {

        Customer customer = customerRepository.findCustomerByEmail(customerSubscription.email())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Could not find customer by email "
                                + customerSubscription.email())
                );

        customer.setIsSubscribed(true);
        customer.setIsLogged(true);
        customerRepository.save(customer);
        return ResponseEntity.ok("Customer Subscribed");
    }

    public boolean isOwner(Long customerId, String username) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        return customer != null && customer.getEmail().equals(username);
    }
}
