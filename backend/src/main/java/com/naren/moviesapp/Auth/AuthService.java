package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dao.CustomerDao;
import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerDTOMapper;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Exception.UserNotFoundException;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomerDTOMapper customerDTOMapper;
    private final JwtUtil jwtUtil;
    private final CustomerService customerService;
    private final CustomerDao customerDao;

    public AuthResponse login(AuthRequest authRequest) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.username(),
                            authRequest.password())
            );

            Object principal = authentication.getPrincipal();
            if (!(principal instanceof Customer)) {
                throw new RuntimeException("Invalid principal type in authentication");
            }
            Customer customerPrincipal = (Customer) principal;

            if (!customerDao.existsByEmail(customerPrincipal.getEmail())) {
                throw new ResourceNotFoundException("Profile not found. " +
                        "If you are new here, consider registering first.");
            }

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

                CustomerDTO updatedCustomerDTO = customerService.updateCustomer
                        (updateRequest, customerPrincipal.getId());

                Set<Role> roles = new HashSet<Role>();
                for (String roleName : updatedCustomerDTO.roles()) {
                    roles.add(new Role(roleName));
                }

                String token = jwtUtil.issueToken(updatedCustomerDTO.email(), roles);

                return new AuthResponse(updatedCustomerDTO, token);
            }

            CustomerDTO customerDTO = customerDTOMapper.apply(customerPrincipal);

            Set<Role> roles = new HashSet<Role>();
            for (String roleName : customerDTO.roles()) {
                roles.add(new Role(roleName));
            }

            String token = jwtUtil.issueToken(customerDTO.email(), roles);

            return new AuthResponse(customerDTO, token);

        } catch (UserNotFoundException e) {
            throw new RuntimeException("Profile not found. If you are new here, " +
                    "consider registering first.");
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Incorrect email or password. Please try again.");
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