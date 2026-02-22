package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Exception.EmailSendingException;
import com.naren.moviesapp.Record.EmailVerificationRequest;
import com.naren.moviesapp.Service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller to handle email verification requests without the /api/v1 prefix.
 * This is needed because some frontend requests may come in as /verify/email
 * instead of /api/v1/verify/email.
 */
@RestController
public class EmailVerifyController {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerifyController.class);
    private final CustomerService customerService;

    public EmailVerifyController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/verify/email")
    public ResponseEntity<?> sendEmailToCustomer(@RequestBody EmailVerificationRequest emailVerificationRequest) {
        logger.info("Sending email verification OTP to (no prefix): {}", emailVerificationRequest.email());
        try {
            customerService.generateAndSendMailOtp(emailVerificationRequest);
            logger.info("OTP sent successfully to email: {}", emailVerificationRequest.email());
            return ResponseEntity.ok("OTP sent to email: " + emailVerificationRequest.email());
        } catch (EmailSendingException e) {
            logger.error("Email sending failed for {}: {}", emailVerificationRequest.email(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send OTP. Please try again later.");
        } catch (Exception e) {
            logger.error("Unexpected error during OTP sending to {}: {}", emailVerificationRequest.email(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send OTP. Please try again later.");
        }
    }
}
