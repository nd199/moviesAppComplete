package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Record.EmailVerificationRequest;
import com.naren.moviesapp.Record.VerifyOtpRequest;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.Utils.OtpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RegVerifyController {

    private static final Logger logger = LoggerFactory.getLogger(RegVerifyController.class);
    private final CustomerService customerService;
    private final OtpService otpService;

    public RegVerifyController(CustomerService customerService, OtpService otpService) {
        this.customerService = customerService;
        this.otpService = otpService;
    }

    @PostMapping("/api/v1/verify/email/exists")
    public ResponseEntity<?> checkEmailExists(@RequestBody EmailVerificationRequest request) {
        logger.info("Checking if email exists: {}", request.email());
        String email = request.email() != null ? request.email().trim().toLowerCase() : null;
        
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        boolean emailExists = customerService.existsByEmail(email);
        logger.info("Email {} exists: {}", email, emailExists);
        
        if (emailExists) {
            return ResponseEntity.ok(Map.of(
                "exists", true,
                "message", "Email already registered"
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                "exists", false,
                "message", "Email is available"
            ));
        }
    }

    @PostMapping(value = {"/api/v1/verify/email", "/verify/email"})
    public ResponseEntity<?> sendEmailToCustomer(@RequestBody EmailVerificationRequest emailVerificationRequest) {
        logger.info("Email verification request for: {}", emailVerificationRequest.email());

        boolean shouldCheckUserExists = emailVerificationRequest.checkUserExists() != null
            ? emailVerificationRequest.checkUserExists()
            : true;

        String email = emailVerificationRequest.email() != null ? emailVerificationRequest.email().trim().toLowerCase() : null;
        if (shouldCheckUserExists && email != null && customerService.existsByEmail(email)) {
            logger.warn("Email already exists: {}", email);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                        "statusCode", 409,
                        "errorCode", "EMAIL_ALREADY_EXISTS",
                        "message", "Email already registered. Please login instead."
                    ));
        }

        customerService.generateAndSendMailOtp(emailVerificationRequest);
        logger.info("OTP sent successfully to email: {}", emailVerificationRequest.email());
        return ResponseEntity.ok("OTP sent to email: " + emailVerificationRequest.email());
    }

    @PostMapping("/api/v1/verify/email/subscription")
    public ResponseEntity<?> sendEmailForSubscription(@RequestBody EmailVerificationRequest emailVerificationRequest) {
        logger.info("Subscription email verification for: {}", emailVerificationRequest.email());
        customerService.generateAndSendMailOtp(emailVerificationRequest);
        return ResponseEntity.ok("OTP sent to email for subscription verification: " + emailVerificationRequest.email());
    }

    @PostMapping("/api/v1/validate/otp/subscription")
    public ResponseEntity<?> verifySubscriptionOtp(@RequestBody VerifyOtpRequest request) {
        String email = request.customerEmail() != null ? request.customerEmail().trim().toLowerCase() : null;
        String enteredOtp = request.enteredOTP() != null ? request.enteredOTP().trim() : null;

        if (email == null && request.email() != null) {
            email = request.email().trim().toLowerCase();
        }
        if (enteredOtp == null && request.otp() != null) {
            enteredOtp = request.otp().trim();
        }

        logger.debug("Verifying subscription OTP for email: {}", email);

        if (email == null || enteredOtp == null) {
            return ResponseEntity.badRequest().body("Email and OTP must be provided");
        }

        try {
            boolean isOtpValid = otpService.validateOtp(email, enteredOtp);

            if (isOtpValid) {
                logger.info("Subscription OTP verified for email: {}", email);
                return ResponseEntity.ok("OTP verified successfully");
            } else {
                logger.warn("Invalid subscription OTP for email: {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid OTP or OTP expired");
            }
        } catch (Exception e) {
            logger.error("Subscription OTP verification failed for {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "statusCode", 500,
                            "errorCode", "INTERNAL_ERROR",
                            "message", "Something went wrong. Please try again later."
                    ));
        }
    }

    @PostMapping(value = {"/api/v1/validate/Otp", "/validate/Otp", "/validate/otp", "/api/v1/validate/otp"})
    public ResponseEntity<?> verifyEmailOtp(@RequestBody VerifyOtpRequest request) {
        String email = request.customerEmail() != null ? request.customerEmail().trim().toLowerCase() : null;
        String enteredOtp = request.enteredOTP() != null ? request.enteredOTP().trim() : null;

        if (email == null && request.email() != null) {
            email = request.email().trim().toLowerCase();
        }
        if (enteredOtp == null && request.otp() != null) {
            enteredOtp = request.otp().trim();
        }

        logger.debug("Verifying OTP for email: {}", email);

        if (email == null || enteredOtp == null) {
            return ResponseEntity.badRequest().body("Email and OTP must be provided");
        }

        try {
            boolean isOtpValid = otpService.validateOtp(email, enteredOtp);

            if (isOtpValid) {
                logger.info("OTP verified for email: {}", email);
                return ResponseEntity.ok("OTP verified successfully");
            } else {
                logger.warn("Invalid OTP for email: {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid OTP or OTP expired");
            }
        } catch (Exception e) {
            logger.error("OTP verification failed for {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "statusCode", 500,
                            "errorCode", "INTERNAL_ERROR",
                            "message", "Something went wrong. Please try again later."
                    ));
        }
    }

}
