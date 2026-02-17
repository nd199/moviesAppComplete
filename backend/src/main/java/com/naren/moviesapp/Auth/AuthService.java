package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dao.CustomerDao;
import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerDTOMapper;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Enum.RoleName;
import com.naren.moviesapp.Exception.*;
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
    private final CustomerDao customerDao;

    public AuthResponse login(AuthRequest authRequest) {

        validateRequest(authRequest);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.username(),
                            authRequest.password())
            );

            Customer customer = (Customer) authentication.getPrincipal();

            validateAccountState(customer);

            if (!Boolean.TRUE.equals(customer.getIsLogged())) {
                customer.setIsLogged(true);
                customerDao.updateCustomer(customer);
            }

            String token = generateTokenForUser(customer);

            return new AuthResponse(customerDTOMapper.apply(customer), token);

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
        } catch (Exception e) {
            System.err.println("Unexpected login error: " + e.getMessage());
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

        if (!customerDao.existsByEmail(customer.getEmail())) {
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
}