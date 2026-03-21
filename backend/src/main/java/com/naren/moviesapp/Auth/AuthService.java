package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.*;
import com.naren.moviesapp.Entity.*;
import com.naren.moviesapp.Exception.*;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Security.AppUserPrincipal;
import com.naren.moviesapp.Service.RefreshTokenService;
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
import java.util.stream.Collectors;

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
    private final com.naren.moviesapp.Repo.ContentManagerRepository contentManagerRepository;
    private final RefreshTokenService refreshTokenService;

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

                return new AdminAuthResponse(dto, dbAdmin, token);
            }

            if (entity instanceof Customer customerEntity) {
                logger.debug("Customer login detected for email: {}", customerEntity.getEmail());

                Customer customer = customerRepository
                        .findByEmailWithRoles(customerEntity.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("User not found")
                        );

                logger.info("Customer found in database: {}", customer.getEmail());

                validateAccountState(customer);

                CustomerDTO dto = customerDTOMapper.apply(customer);

                // Normalize email to lowercase to match frontend login normalization
                String normalizedEmail = dto.email() != null ? dto.email().toLowerCase().trim() : dto.email();
                
                String token = jwtUtil.issueToken(
                        normalizedEmail,
                        new HashSet<>(customer.getRoles())
                );

                logger.info("Customer login successful for email: {}", customer.getEmail());

                long totalTime = System.currentTimeMillis() - startTime;
                logger.info("Total login process completed in {}ms for: {}", totalTime, customer.getEmail());

                return new CustomerAuthResponse(dto, customer, token);
            }

            if (entity instanceof ContentManager contentManager) {
                logger.debug("Content Manager login detected for email: {}", contentManager.getEmail());

                com.naren.moviesapp.Entity.ContentManager cm = contentManagerRepository
                        .findByEmail(contentManager.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Content Manager not found")
                        );

                logger.info("Content Manager found in database: {}", cm.getEmail());

                String token = jwtUtil.issueToken(
                        cm.getEmail(),
                        new HashSet<>(cm.getRoles())
                );

                logger.info("Content Manager login successful for email: {}", cm.getEmail());

                long totalTime = System.currentTimeMillis() - startTime;
                logger.info("Total login process completed in {}ms for: {}", totalTime, cm.getEmail());

                ContentManagerDTO cmDTO = new ContentManagerDTO(
                        cm.getId(),
                        cm.getName(),
                        cm.getEmail(),
                        cm.getPhoneNumber(),
                        cm.getDepartment(),
                        cm.getSpecialization(),
                        cm.getIsActive(),
                        cm.getCreatedAt(),
                        cm.getUpdatedAt(),
                        cm.getImageUrl(),
                        cm.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toSet())
                );

                return new ContentManagerAuthResponse(cmDTO, cm, token);
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

        // Account is considered registered if the customer record exists and is active
        // isRegistered was redundant - a user is either in the system or not
        if (!isSuperAdmin && !Boolean.TRUE.equals(customer.getIsActive())) {
            logger.warn("Account validation failed for {}: Account is not active", customer.getEmail());
            throw new AccountNotRegisteredException(
                    "Account is not active."
            );
        }
        logger.debug("Account state validation passed for customer: {}", customer.getEmail());
    }

    public String generateTokenFromRefreshToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenValue);
        if (refreshToken == null) {
            throw new RuntimeException("Refresh token not found");
        }

        refreshTokenService.verifyExpiration(refreshToken);

        // Load user based on type and generate token
        if (UserType.ADMIN.equals(refreshToken.getUserType())) {
            Admin admin = adminRepository.findById(refreshToken.getUserId())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            return generateTokenForAdmin(admin);
        } else if (UserType.CUSTOMER.equals(refreshToken.getUserType())) {
            Customer customer = customerRepository.findById(refreshToken.getUserId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            CustomerDTO customerDTO = customerDTOMapper.apply(customer);

            Set<Role> roles = new HashSet<Role>();
            for (String roleName : customerDTO.roles()) {
                roles.add(new Role(RoleName.valueOf(roleName)));
            }

            return jwtUtil.issueToken(customerDTO.email(), roles);
        }

        throw new RuntimeException("Unknown user type: " + refreshToken.getUserType());
    }

    public String generateTokenForCustomer(Customer customer) {
        logger.info("Generating token for customer: {}", customer.getEmail());
        CustomerDTO customerDTO = customerDTOMapper.apply(customer);
        // Normalize email to lowercase for consistent token subject
        String normalizedEmail = customerDTO.email() != null ? customerDTO.email().toLowerCase().trim() : customerDTO.email();

        Set<Role> roles = new HashSet<Role>();
        for (String roleName : customerDTO.roles()) {
            roles.add(new Role(RoleName.valueOf(roleName)));
        }

        return jwtUtil.issueToken(normalizedEmail, roles);
    }

    public String generateTokenForContentManager(ContentManager contentManager) {
        logger.info("Generating token for content manager: {}", contentManager.getEmail());
        // Normalize email to lowercase for consistent token subject
        String normalizedEmail = contentManager.getEmail() != null ? contentManager.getEmail().toLowerCase().trim() : contentManager.getEmail();
        return jwtUtil.issueToken(normalizedEmail, contentManager.getRoles());
    }

    public String generateTokenForAdmin(Admin admin) {
        logger.info("Generating token for admin: {}", admin.getEmail());
        // Normalize email to lowercase for consistent token subject
        String normalizedEmail = admin.getEmail() != null ? admin.getEmail().toLowerCase().trim() : admin.getEmail();
        Set<Role> roles = new HashSet<>(admin.getRoles());
        return jwtUtil.issueTokenWithRoleExpiration(normalizedEmail, roles);
    }
}
