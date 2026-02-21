package com.naren.moviesapp.Auth;

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
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomerDTOMapper customerDTOMapper;
    private final JwtUtil jwtUtil;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    @Transactional
    public AuthResponse login(AuthRequest authRequest) {

        validateRequest(authRequest);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.username(),
                            authRequest.password())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Get the actual entity from AppUserPrincipal
            if (userDetails instanceof AppUserPrincipal appUserPrincipal) {
                Object entity = appUserPrincipal.getUserEntity();
                
                if (entity instanceof Customer) {
                    // Re-fetch from database to get fresh data with roles initialized
                    Customer customer = customerRepository.findByEmail(authRequest.username())
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    // Force initialize roles
                    customer.getRoles().size();
                    
                    validateAccountState(customer);
                    String token = generateTokenForUser(customer);
                    return new AuthResponse(customerDTOMapper.apply(customer), token);
                } else if (entity instanceof Admin) {
                    // Re-fetch from database to get fresh data with roles initialized
                    Admin admin = adminRepository.findByEmail(authRequest.username())
                            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
                    // Force initialize roles
                    admin.getRoles().size();
                    
                    String token = generateTokenForAdmin(admin);
                    return new AuthResponse(customerDTOMapper.apply(convertAdminToCustomer(admin)), token);
                }
            }
            
            throw new AuthenticationException("Unknown user type", "UNKNOWN_USER_TYPE");

        } catch (DisabledException e) {
            throw new AuthenticationException(
                    "Account has been disabled. Please contact support.",
                    "ACCOUNT_DISABLED"
            );
        } catch (LockedException e) {
            throw new AccountLockedException(
                    "Account has been locked due to multiple failed login attempts. Please try again later or contact support."
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException(
                    "Invalid email or password. Please check your credentials and try again."
            );
        } catch (ResourceNotFoundException |
                 EmailNotVerifiedException |
                 AccountNotRegisteredException e) {
            throw e;
        } catch (AuthenticationException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected login error: " + e.getMessage());
            e.printStackTrace();
            throw new AuthenticationException(
                    "Login failed due to an unexpected error. Please try again later.",
                    "LOGIN_ERROR",
                    e
            );
        }
    }

    private void validateRequest(AuthRequest authRequest) {
        if (authRequest.username() == null || authRequest.username().trim().isEmpty()) {
            throw new AuthenticationException("Email address is required", "MISSING_EMAIL");
        }

        if (authRequest.password() == null || authRequest.password().trim().isEmpty()) {
            throw new AuthenticationException("Password is required", "MISSING_PASSWORD");
        }
    }

    private void validateAccountState(Customer customer) {

        if (!customerRepository.existsByEmail(customer.getEmail())) {
            throw new ResourceNotFoundException(
                    "Account not found. Please check your email or register for a new account."
            );
        }

        boolean isSuperAdmin = customer.getRoles().stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_SUPER_ADMIN);

        if (!isSuperAdmin && !Boolean.TRUE.equals(customer.getIsEmailVerified())) {
            throw new EmailNotVerifiedException(
                    "Email address not verified. Please check your inbox and verify your email before logging in."
            );
        }

        if (!isSuperAdmin && !Boolean.TRUE.equals(customer.getIsRegistered())) {
            throw new AccountNotRegisteredException(
                    "Account registration incomplete. Please complete the registration process."
            );
        }
    }


    public String generateTokenForUser(Customer user) {
        CustomerDTO customerDTO = customerDTOMapper.apply(user);

        Set<Role> roles = new HashSet<Role>();
        for (String roleName : customerDTO.roles()) {
            roles.add(new Role(RoleName.valueOf(roleName)));
        }

        return jwtUtil.issueToken(customerDTO.email(), roles);
    }

    private String generateTokenForAdmin(Admin admin) {
        Set<Role> roles = new HashSet<>(admin.getRoles());
        return jwtUtil.issueToken(admin.getEmail(), roles);
    }

    // Helper to convert Admin to CustomerDTO for response
    private Customer convertAdminToCustomer(Admin admin) {
        return new Customer(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getPassword(),
                admin.getPhoneNumber(),
                admin.getIsEmailVerified(),
                admin.getAddress(),
                admin.getIsRegistered(),
                null,
                admin.getRoles(),
                null
        );
    }
}
