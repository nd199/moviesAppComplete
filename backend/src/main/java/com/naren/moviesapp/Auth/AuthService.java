package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.AdminDTO;
import com.naren.moviesapp.Dto.AdminDTOMapper;
import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerDTOMapper;
import com.naren.moviesapp.Entity.Admin;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Exception.*;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Security.AppUserPrincipal;
import com.naren.moviesapp.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final CustomerDTOMapper customerDTOMapper;
    private final AdminDTOMapper adminDTOMapper;
    private final JwtUtil jwtUtil;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    @Transactional
    public AuthResponse login(AuthRequest authRequest) {
        long startTime = System.currentTimeMillis();
        logger.info("Login attempt started for username: {}", authRequest.username());

        validateRequest(authRequest);

        try {
            logger.debug("Starting authentication process for: {}", authRequest.username());
            long authStartTime = System.currentTimeMillis();

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    authRequest.username(),
                                    authRequest.password()
                            )
                    );

            long authEndTime = System.currentTimeMillis();
            logger.info("Authentication completed in {}ms for: {}",
                    authEndTime - authStartTime, authRequest.username());

            AppUserPrincipal principal =
                    (AppUserPrincipal) authentication.getPrincipal();

            Object entity = principal.getUserEntity();

            if (entity instanceof Admin admin) {
                logger.debug("Admin login detected for email: {}", admin.getEmail());

                Admin dbAdmin = adminRepository
                        .findByEmail(admin.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Admin not found")
                        );

                logger.info("Admin found in database: {}", dbAdmin.getEmail());

                String token = generateTokenForAdmin(dbAdmin);

                AdminDTO dto = adminDTOMapper.apply(dbAdmin);

                logger.info("Admin login successful for email: {}", dbAdmin.getEmail());

                long totalTime = System.currentTimeMillis() - startTime;
                logger.info("Total admin login process completed in {}ms for: {}", totalTime, dbAdmin.getEmail());

                return new AdminAuthResponse(dto, token);
            }

            if (entity instanceof Customer customerEntity) {
                logger.debug("Customer login detected for email: {}", customerEntity.getEmail());

                Customer customer = customerRepository
                        .findByEmail(customerEntity.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("User not found")
                        );

                logger.info("Customer found in database: {}", customer.getEmail());

                validateAccountState(customer);

                customer.setIsSubscribed(true);
                customerRepository.save(customer);

                CustomerDTO dto = customerDTOMapper.apply(customer);

                String token = jwtUtil.issueToken(
                        dto.email(),
                        new HashSet<>(customer.getRoles())
                );

                logger.info("Customer login successful for email: {}", customer.getEmail());

                long totalTime = System.currentTimeMillis() - startTime;
                logger.info("Total login process completed in {}ms for: {}", totalTime, customer.getEmail());

                return new CustomerAuthResponse(dto, token);
            }

            throw new AuthenticationException("Invalid principal type", "INVALID_PRINCIPAL");

        } catch (BadCredentialsException e) {
            logger.warn("Login failed for username: {} - Invalid credentials", authRequest.username());
            throw new InvalidCredentialsException(
                    "Invalid email or password. Please check your credentials and try again."
            );
        }
    }

    private Set<Role> buildRoles(CustomerDTO dto) {
        logger.debug("Building roles for customer DTO");
        Set<Role> roles = new HashSet<>();
        for (String roleName : dto.roles()) {
            roles.add(new Role(RoleName.valueOf(roleName)));
        }
        return roles;
    }

    private void validateRequest(AuthRequest authRequest) {
        logger.debug("Validating login request for username: {}", authRequest.username());
        if (authRequest.username() == null || authRequest.username().trim().isEmpty()) {
            logger.warn("Login validation failed: Email address is required");
            throw new AuthenticationException("Email address is required", "MISSING_EMAIL");
        }

        if (authRequest.password() == null || authRequest.password().trim().isEmpty()) {
            logger.warn("Login validation failed: Password is required");
            throw new AuthenticationException("Password is required", "MISSING_PASSWORD");
        }
    }

    private void validateAccountState(Customer customer) {
        logger.debug("Validating account state for customer: {}", customer.getEmail());

        boolean isSuperAdmin = customer.getRoles().stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_SUPER_ADMIN);

        if (!isSuperAdmin && !Boolean.TRUE.equals(customer.getIsEmailVerified())) {
            logger.warn("Account validation failed for {}: Email not verified", customer.getEmail());
            throw new EmailNotVerifiedException(
                    "Email address not verified."
            );
        }

        if (!isSuperAdmin && !Boolean.TRUE.equals(customer.getIsRegistered())) {
            logger.warn("Account validation failed for {}: Account not registered", customer.getEmail());
            throw new AccountNotRegisteredException(
                    "Account registration incomplete."
            );
        }
        logger.debug("Account state validation passed for customer: {}", customer.getEmail());
    }

    public String generateTokenForUser(Customer user) {
        logger.info("Generating token for user: {}", user.getEmail());
        CustomerDTO customerDTO = customerDTOMapper.apply(user);

        Set<Role> roles = new HashSet<Role>();
        for (String roleName : customerDTO.roles()) {
            roles.add(new Role(RoleName.valueOf(roleName)));
        }

        String token = jwtUtil.issueToken(customerDTO.email(), roles);
        logger.debug("Token generated successfully for user: {}", user.getEmail());
        return token;
    }

    private String generateTokenForAdmin(Admin admin) {
        logger.debug("Generating token for admin: {}", admin.getEmail());
        Set<Role> roles = new HashSet<>(admin.getRoles());
        return jwtUtil.issueToken(admin.getEmail(), roles);
    }
}
