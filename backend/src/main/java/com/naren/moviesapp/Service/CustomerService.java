package com.naren.moviesapp.Service;

import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerDTOMapper;
import com.naren.moviesapp.Dto.CustomerStatsDTO;
import com.naren.moviesapp.Entity.*;
import com.naren.moviesapp.Exception.*;
import com.naren.moviesapp.Record.CustomerRegistration;
import com.naren.moviesapp.Record.CustomerSubscription;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Record.EmailVerificationRequest;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.MovieRepository;
import com.naren.moviesapp.Utils.OtpService;
import com.naren.moviesapp.jwt.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
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
    public List<Role> getRoles() {
        return roleService.getAllRoles();
    }

    @Override
    public Role getRoleById(Long id) {
        return roleService.findRoleById(id);
    }

    @Override
    public void removeRole(Long id) {
        Role role = getRoleById(id);
        if (role == null) {
            throw new ResourceNotFoundException("Role not found");
        }
        roleService.deleteRole(id);
    }

    @Override
    @Transactional
    public ResponseEntity<?> registerUser(CustomerRegistration customerRegistration, Set<String> roleNames) {

        logger.info("Attempting to register new user with email: {}", customerRegistration.email());

        if (roleNames == null || !roleNames.equals(Set.of("ROLE_USER"))) {
            throw new AccessDeniedException("Invalid role assignment attempted " +
                    "during customer registration.");
        }

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
            registeredCustomer.setImageUrl(customerRegistration.imageUrl());
            customerRepository.save(registeredCustomer);

            String token = jwtUtil.issueToken(registeredCustomer.getEmail(), roles);
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
                "", false, customerRegistration.address(), false);
    }

    private boolean validatePassword(String password, String name, String email, String phoneNumber) {
        if (password == null || password.length() < REQ_PASSWORD_LENGTH) {
            throw new PasswordInvalidException("Password must be at least %s characters long".formatted(REQ_PASSWORD_LENGTH));
        }
        return !containsPersonalInfo(password, name, email, phoneNumber);
    }

    private boolean containsPersonalInfo(String password, String name, String email, String phoneNumber) {
        String passwordLower = password.toLowerCase();

        // Check name parts (3+ characters)
        if (name != null) {
            String[] nameParts = name.toLowerCase().split(" ");
            for (String part : nameParts) {
                if (part.length() >= 3 && passwordLower.contains(part)) {
                    throw new PasswordInvalidException("Password must " +
                            "not contain personal info [Name,Email,Phone] ");
                }
            }
        }

        // Check email local part (before @)
        if (email != null) {
            String emailLocal = email.toLowerCase().split("@")[0];
            if (emailLocal.length() >= 3 && passwordLower.contains(emailLocal)) {
                throw new PasswordInvalidException("Password must " +
                        "not contain personal info [Name,Email,Phone] ");
            }
        }

        // Check phone number sequences (4+ digits to be less strict)
        if (phoneNumber != null) {
            String phoneDigits = phoneNumber.replaceAll("\\D", "");
            for (int i = 0; i <= phoneDigits.length() - 4; i++) {
                String sequence = phoneDigits.substring(i, i + 4);
                if (password.contains(sequence)) {
                    throw new PasswordInvalidException("Password must " +
                            "not contain personal info [Name,Email,Phone] ");
                }
            }
        }

        return false;
    }

    private void applyAdminDefaults(Customer registeredCustomer, Set<Role> roles) {
        if (roles.stream().anyMatch(role -> "ROLE_ADMIN".equals(role.getName()))) {
            registeredCustomer.setAddress("CN.io, Inc.");
        }
    }

    @Override
    public CustomerDTO getCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .map(customerDTOMapper)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Customer with ID " + customerId + " not found");
                });
    }

    @Override
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
            if (customerRepository.existsByPhoneNumber(request.phoneNumber())) {
                throw new ResourceAlreadyExists("Phone number already taken");
            }
            customer.setPhoneNumber(request.phoneNumber());
            changes = true;
        }
        if (request.address() != null && !request.address().equals(customer.getAddress())) {
            customer.setAddress(request.address());
            changes = true;
        }

        if (request.imageUrl() != null && !request.imageUrl().equals(customer.getImageUrl())) {
            if (customer.getImageUrl() != null || !request.imageUrl().isEmpty()) {
                customer.setImageUrl(request.imageUrl());
                changes = true;
            }
        }

        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }

        customerRepository.save(customer);

        return customerDTOMapper.apply(customer);
    }

    @Override

    @Transactional
    public void updatePassword(String email, String newPassword) {
        logger.info("Password update request for email: {}", email);

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Password update failed - user not found: {}", email);
                    return new ResourceNotFoundException("Customer with email "
                            + email + " not found");
                });

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

    @Transactional
    public void updatePasswordWithValidation(String email, String currentPassword, String newPassword) {
        logger.info("Password update request with current password validation for email: {}", email);

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Password update failed - user not found: {}", email);
                    return new ResourceNotFoundException("Customer with email "
                            + email + " not found");
                });

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, customer.getPassword())) {
            logger.warn("Password update failed - current password incorrect for email: {}", email);
            throw new PasswordInvalidException("Current password is incorrect");
        }

        // Check if new password is same as current
        if (passwordEncoder.matches(newPassword, customer.getPassword())) {
            logger.warn("Password update failed - new password same as current for email: {}", email);
            throw new PasswordInvalidException("New password cannot be the same as your current password");
        }

        // Validate new password strength
        var passwordIsValid = validatePassword(newPassword, customer.getName(), customer.getEmail(), customer.getPhoneNumber());
        if (!passwordIsValid) {
            logger.warn("Password update failed - validation error for email: {}", email);
            throw new PasswordInvalidException("Invalid password. Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character.");
        }

        // Update password
        customer.setPassword(passwordEncoder.encode(newPassword));
        customerRepository.save(customer);

        logger.info("Password successfully updated for email: {}", email);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        List<CustomerDTO> customers = customerRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 20)).getContent()
                .stream()
                .map(customerDTOMapper)
                .toList();
        return customers;
    }

    @Override
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
    public CustomerDTO getCustomerByEmail(String email) {
        return customerRepository.findByEmailWithRoles(email).map((customerDTOMapper))
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Could not find customer by email " + email)
                );
    }

    @Override
    public Customer getCustomerEntityByEmail(String email) {
        return customerRepository.findByEmail(email)
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
    public List<CustomerDTO> getLatestCustomerList() {
        return customerRepository.getCustomersByTop5()
                .stream().map(customerDTOMapper)
                .toList();
    }

    @Override
    public List<CustomerStatsDTO> getCustomerStats() {
        return customerRepository.getCustomerCountByEachMonthInYear()
                .stream()
                .map(result -> new CustomerStatsDTO(((Number) result[0]).intValue(),
                        ((Number) result[1]).longValue()))
                .toList();
    }

    @Override
    public ResponseEntity<?> pingSubscription(CustomerSubscription customerSubscription) {

        Customer customer = customerRepository.findByEmail(customerSubscription.email())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Could not find customer by email "
                                + customerSubscription.email())
                );

        customer.setIsSubscribed(true);
        customerRepository.save(customer);
        return ResponseEntity.ok("Customer Subscribed");
    }

    public boolean isOwner(Long customerId, String username) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        return customer != null && customer.getEmail().equals(username);
    }

    public boolean hasActiveSubscription(Customer customer) {
        if (customer == null) {
            return false;
        }
        if (!customer.getIsActive()) {
            return false;
        }
        UserPlanInfo userPlanInfo = customer.getUserPlanInfo();
        if (userPlanInfo == null) {
            return false;
        }
        if (!userPlanInfo.getIsActive()) {
            return false;
        }
        if (userPlanInfo.getSubscriptionEndDate() == null) {
            return false;
        }
        if (userPlanInfo.getSubscriptionEndDate().isBefore(LocalDateTime.now())) {
            return false;
        }
        return true;
    }

    public boolean hasActiveSubscription(String email) {
        Customer customer = customerRepository.findByEmail(email).orElse(null);
        return hasActiveSubscription(customer);
    }

    public boolean existsByEmail(String email) {
        return customerRepository.existsByEmail(email);
    }
}
