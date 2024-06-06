package com.naren.movieticketbookingapplication.Utilities;

import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Record.CustomerUpdateRequest;
import com.naren.movieticketbookingapplication.Service.CustomerService;
import com.naren.movieticketbookingapplication.jwt.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class VerificationService {

    private final CustomerService customerService;
    private final JwtUtil jwtUtil;

    public VerificationService(CustomerService customerService, JwtUtil jwtUtil) {
        this.customerService = customerService;
        this.jwtUtil = jwtUtil;
    }

    public ResponseEntity<String> verifyEmail(String token) {
        try {
            log.debug("Verifying email with token: {}", token);
            String verificationToken = jwtUtil.extractVerificationToken(token);
            Claims claims = jwtUtil.getClaims(token, true);
            String email = (String) claims.get("subject");

            boolean isVerified = customerService.verifyEmail(verificationToken);

            if (isVerified) {
                Customer customer = customerService.getCustomerByEmail(email);

                CustomerUpdateRequest updateRequest = new CustomerUpdateRequest(
                        customer.getName(),
                        customer.getEmail(),
                        customer.getPhoneNumber(),
                        true
                );

                customerService.updateCustomer(updateRequest, customer.getCustomer_id());

                log.debug("Email address successfully verified for: {}", email);
                return ResponseEntity.ok("Email address successfully verified!");

            } else {
                log.warn("Invalid verification token for email: {}", email);
                return ResponseEntity.badRequest().body("Invalid verification token.");
            }
        } catch (Exception e) {
            log.error("Invalid token or token has expired: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid token or token has expired.");
        }
    }
}
