package com.naren.movieticketbookingapplication.Auth;

import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Dto.CustomerDTOMapper;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Exception.UserNotFoundException;
import com.naren.movieticketbookingapplication.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomerDTOMapper customerDTOMapper;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.username(),
                            authRequest.password())
            );

            Customer principal;

            principal = (Customer) authentication.getPrincipal();
            principal.setIsLogged(true);

            CustomerDTO customerDTO = customerDTOMapper.apply(principal);
            Set<Role> roles = customerDTO.roles()
                    .stream().map(Role::new)
                    .collect(Collectors.toSet());

            String token = jwtUtil.issueToken(customerDTO.email(), roles);

            return new AuthResponse(customerDTO, token);
        } catch (UserNotFoundException e) {
            throw new UserNotFoundException("Profile Not Found, " +
                    "If you are new here consider registering first, else contact us");
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Bad credentials");
        }
    }
}

