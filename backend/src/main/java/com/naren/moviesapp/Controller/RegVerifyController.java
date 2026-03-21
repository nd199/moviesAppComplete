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
    public static boolean getOtpResult = false;
    private final CustomerService customerService;
    private final OtpService otpService;

    public RegVerifyController(CustomerService customerService, OtpService otpService) {
        this.customerService = customerService;
        this.otpService = otpService;
    }

    // Check if email already exists in the database
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

    // Handle both /api/v1/verify/email and /verify/email (for frontend compatibility)
    // Use checkUserExists parameter to decide whether to check if user exists
    // Default is true for backward compatibility
    @PostMapping(value = {"/api/v1/verify/email", "/verify/email"})
    public ResponseEntity<?> sendEmailToCustomer(@RequestBody EmailVerificationRequest emailVerificationRequest) {
        logger.info("=== EMAIL VERIFICATION ENDPOINT CALLED ===");
        logger.info("Request received for email: {}", emailVerificationRequest.email());
        logger.info("Request body: {}", emailVerificationRequest);
        
        // Default to true for backward compatibility
        boolean shouldCheckUserExists = emailVerificationRequest.checkUserExists() != null 
            ? emailVerificationRequest.checkUserExists() 
            : true;
        
        logger.info("checkUserExists flag: {}", shouldCheckUserExists);
        
        // Only check if email already exists if checkUserExists is true (default behavior)
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

    // Pre-subscription email verification - does NOT check if user exists
    @PostMapping("/api/v1/verify/email/subscription")
    public ResponseEntity<?> sendEmailForSubscription(@RequestBody EmailVerificationRequest emailVerificationRequest) {
        logger.info("=== SUBSCRIPTION EMAIL VERIFICATION ENDPOINT CALLED ===");
        logger.info("Request received for subscription email: {}", emailVerificationRequest.email());
        
        // DO NOT check if email exists - this is for pre-subscription verification only
        // The user may or may not be registered - we just verify the email is valid
        customerService.generateAndSendMailOtp(emailVerificationRequest);
        logger.info("OTP sent successfully for subscription to email: {}", emailVerificationRequest.email());
        return ResponseEntity.ok("OTP sent to email for subscription verification: " + emailVerificationRequest.email());
    }

    // OTP validation for subscription - separate endpoint
    @PostMapping("/api/v1/validate/otp/subscription")
    public ResponseEntity<?> verifySubscriptionOtp(@RequestBody VerifyOtpRequest request) {
        String email = request.customerEmail() != null ? request.customerEmail().trim().toLowerCase() : null;
        String enteredOtp = request.enteredOTP() != null ? request.enteredOTP().trim() : null;

        logger.debug("Verifying subscription OTP for email: '{}' OTP: '{}'", email, enteredOtp);

        if (email == null || enteredOtp == null) {
            return ResponseEntity.badRequest().body("Email and OTP must be provided");
        }

        try {
            boolean isOtpValid = otpService.validateOtp(email, enteredOtp);

            if (isOtpValid) {
                logger.info("Subscription OTP verified successfully for email: {}", email);
                return ResponseEntity.ok("OTP verified successfully");
            } else {
                logger.warn("Invalid or expired subscription OTP for email: {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid OTP or OTP expired");
            }
        } catch (Exception e) {
            logger.error("Exception during subscription OTP verification for email {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "statusCode", 500,
                            "errorCode", "INTERNAL_ERROR",
                            "message", "Something went wrong on our side. Please try again later.",
                            "path", "/validate/otp/subscription",
                            "localDateTime", java.time.LocalDateTime.now().toString()
                    ));
        }
    }

    @PostMapping(value = {"/api/v1/validate/Otp", "/validate/Otp", "/validate/otp", "/api/v1/validate/otp"})
    public ResponseEntity<?> verifyEmailOtp(@RequestBody VerifyOtpRequest request) {
        String email = request.customerEmail() != null ? request.customerEmail().trim().toLowerCase() : null;
        String enteredOtp = request.enteredOTP() != null ? request.enteredOTP().trim() : null;

        logger.debug("Verifying OTP for email: '{}' OTP: '{}'", email, enteredOtp);

        if (email == null || enteredOtp == null) {
            return ResponseEntity.badRequest().body("Email and OTP must be provided");
        }

        try {
            boolean isOtpValid = otpService.validateOtp(email, enteredOtp);

            if (isOtpValid) {
                logger.info("OTP verified successfully for email: {}", email);
                return ResponseEntity.ok("OTP verified successfully");
            } else {
                logger.warn("Invalid or expired OTP for email: {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid OTP or OTP expired");
            }
        } catch (Exception e) {
            logger.error("Exception during OTP verification for email {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "statusCode", 500,
                            "errorCode", "INTERNAL_ERROR",
                            "message", "Something went wrong on our side. Please try again later.",
                            "path", "/validate/Otp",
                            "localDateTime", java.time.LocalDateTime.now().toString()
                    ));
        }
    }

}
