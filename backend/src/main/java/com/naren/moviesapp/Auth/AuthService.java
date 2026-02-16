package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dao.CustomerDao;
import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerDTOMapper;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Exception.*;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomerDTOMapper customerDTOMapper;
    private final JwtUtil jwtUtil;
    private final CustomerService customerService;
    private final CustomerDao customerDao;

    public AuthResponse login(AuthRequest authRequest) {
        // Validate input parameters
        if (authRequest.username() == null || authRequest.username().trim().isEmpty()) {
            throw new AuthenticationException("Email address is required", "MISSING_EMAIL");
        }

        if (authRequest.password() == null || authRequest.password().trim().isEmpty()) {
            throw new AuthenticationException("Password is required", "MISSING_PASSWORD");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.username(),
                            authRequest.password())
            );

            Object principal = authentication.getPrincipal();
            if (!(principal instanceof Customer)) {
                throw new AuthenticationException("Invalid authentication result", "INVALID_PRINCIPAL");
            }

            Customer customerPrincipal = (Customer) principal;

            // Check if customer exists in database
            if (!customerDao.existsByEmail(customerPrincipal.getEmail())) {
                throw new ResourceNotFoundException("Account not found. Please check your email or register for a new account.");
            }

            // Check if email is verified
            if (!Boolean.TRUE.equals(customerPrincipal.getIsEmailVerified())) {
                throw new EmailNotVerifiedException(
                        "Email address not verified. Please check your inbox and verify your email before logging in.");
            }

            // Check if account is registered
            if (!Boolean.TRUE.equals(customerPrincipal.getIsRegistered())) {
                throw new AccountNotRegisteredException(
                        "Account registration incomplete. Please complete the registration process.");
            }

            // Update login status
            if (!Boolean.TRUE.equals(customerPrincipal.getIsLogged())) {
                CustomerUpdateRequest updateRequest = new CustomerUpdateRequest(
                        customerPrincipal.getName(),
                        customerPrincipal.getEmail(),
                        customerPrincipal.getPhoneNumber(),
                        customerPrincipal.getImageUrl(),
                        customerPrincipal.getIsEmailVerified(),
                        customerPrincipal.getAddress(),
                        true,
                        customerPrincipal.getIsRegistered()
                );

                CustomerDTO updatedCustomerDTO = customerService.updateCustomer(
                        updateRequest, customerPrincipal.getId());

                Set<Role> roles = new HashSet<>();
                for (String roleName : updatedCustomerDTO.roles()) {
                    roles.add(new Role(roleName));
                }

                String token = jwtUtil.issueToken(updatedCustomerDTO.email(), roles);

                return new AuthResponse(updatedCustomerDTO, token);
            }

            // Customer is already logged in, return existing session
            CustomerDTO customerDTO = customerDTOMapper.apply(customerPrincipal);

            Set<Role> roles = new HashSet<>();
            for (String roleName : customerDTO.roles()) {
                roles.add(new Role(roleName));
            }

            String token = jwtUtil.issueToken(customerDTO.email(), roles);

            return new AuthResponse(customerDTO, token);

        } catch (DisabledException e) {
            throw new AuthenticationException("Account has been disabled. Please contact support.", "ACCOUNT_DISABLED");
        } catch (LockedException e) {
            throw new AccountLockedException("Account has been locked due to multiple failed login attempts. Please try again later or contact support.");
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid email or password. Please check your credentials and try again.");
        } catch (ResourceNotFoundException | EmailNotVerifiedException | AccountNotRegisteredException e) {
            // Re-throw our custom exceptions
            throw e;
        } catch (AuthenticationException e) {
            // Re-throw authentication exceptions that weren't handled above
            throw e;
        } catch (Exception e) {
            // Log the actual error for debugging
            System.err.println("Unexpected login error: " + e.getMessage());
            throw new AuthenticationException("Login failed due to an unexpected error. Please try again later.", "LOGIN_ERROR", e);
        }
    }

    public String generateTokenForUser(Customer user) {
        CustomerDTO customerDTO = customerDTOMapper.apply(user);

        Set<Role> roles = new HashSet<Role>();
        for (String roleName : customerDTO.roles()) {
            roles.add(new Role(roleName));
        }

        return jwtUtil.issueToken(customerDTO.email(), roles);
    }
}