package com.naren.movieticketbookingapplication.Controller;

import com.naren.movieticketbookingapplication.Auth.AuthRequest;
import com.naren.movieticketbookingapplication.Auth.AuthResponse;
import com.naren.movieticketbookingapplication.Auth.AuthService;
import com.naren.movieticketbookingapplication.Record.CustomerRegistration;
import com.naren.movieticketbookingapplication.Service.CustomerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final CustomerService customerService;

    public AuthController(AuthService authService, CustomerService customerService) {
        this.authService = authService;
        this.customerService = customerService;
    }

    @PostMapping("/customers")
    public ResponseEntity<?> addCustomer(@RequestBody CustomerRegistration customerRegistration) {
        log.info("Received request to add customer: {}", customerRegistration);
        ResponseEntity<?> response = customerService.registerUser(customerRegistration, Set.of("ROLE_USER"));
        log.info("Customer registration response: {}", response);
        return response;
    }

    @PostMapping("/admins")
    public ResponseEntity<?> addAdmin(@RequestBody CustomerRegistration customerRegistration) {
        log.info("Received request to add admin: {}", customerRegistration);
        ResponseEntity<?> response = customerService.registerUser(customerRegistration, Set.of("ROLE_ADMIN"));
        log.info("Admin registration response: {}", response);
        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        AuthResponse authResponse = authService.login(authRequest);
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION)
                .body(authResponse.customerDTO());

    }

    @PostMapping("/loginAdmin")
    public ResponseEntity<?> loginAdmin(@RequestBody AuthRequest authRequest) {
        AuthResponse authResponse = authService.login(authRequest);
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION)
                .body(authResponse.customerDTO());
    }

}
