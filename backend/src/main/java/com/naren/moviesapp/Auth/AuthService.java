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

    private final AuthenticationManager authenticationManager;
    private final CustomerDTOMapper customerDTOMapper;
    private final JwtUtil jwtUtil;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    @Transactional
    public AuthResponse login(AuthRequest authRequest) {

        validateRequest(authRequest);

        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    authRequest.username(),
                                    authRequest.password()
                            )
                    );

            AppUserPrincipal principal =
                    (AppUserPrincipal) authentication.getPrincipal();

            Object entity = principal.getUserEntity();

            if (entity instanceof Admin admin) {

                Admin dbAdmin = adminRepository
                        .findByEmail(admin.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Admin not found")
                        );

                String token = generateTokenForAdmin(dbAdmin);

                CustomerDTO dto = customerDTOMapper.applyFromAdmin(dbAdmin);

                return new AuthResponse(dto, token);
            }

            if (entity instanceof Customer customerEntity) {

                Customer customer = customerRepository
                        .findByEmail(customerEntity.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("User not found")
                        );

                validateAccountState(customer);

                customer.setIsSubscribed(true);
                customerRepository.save(customer);

                CustomerDTO dto = customerDTOMapper.apply(customer);

                String token = jwtUtil.issueToken(
                        dto.email(),
                        new HashSet<>(customer.getRoles())
                );

                return new AuthResponse(dto, token);
            }

            throw new AuthenticationException("Invalid principal type", "INVALID_PRINCIPAL");

        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException(
                    "Invalid email or password. Please check your credentials and try again."
            );
        }
    }

    private Set<Role> buildRoles(CustomerDTO dto) {
        Set<Role> roles = new HashSet<>();
        for (String roleName : dto.roles()) {
            roles.add(new Role(RoleName.valueOf(roleName)));
        }
        return roles;
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

        boolean isSuperAdmin = customer.getRoles().stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_SUPER_ADMIN);

        if (!isSuperAdmin && !Boolean.TRUE.equals(customer.getIsEmailVerified())) {
            throw new EmailNotVerifiedException(
                    "Email address not verified."
            );
        }

        if (!isSuperAdmin && !Boolean.TRUE.equals(customer.getIsRegistered())) {
            throw new AccountNotRegisteredException(
                    "Account registration incomplete."
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
}
