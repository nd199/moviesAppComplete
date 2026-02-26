package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Exception.EmailSendingException;
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

    // Handle both /api/v1/verify/email and /verify/email (for frontend compatibility)
    @PostMapping(value = {"/api/v1/verify/email", "/verify/email"})
    public ResponseEntity<?> sendEmailToCustomer(@RequestBody EmailVerificationRequest emailVerificationRequest) {
        logger.info("=== EMAIL VERIFICATION ENDPOINT CALLED ===");
        logger.info("Request received for email: {}", emailVerificationRequest.email());
        logger.info("Request body: {}", emailVerificationRequest);
        
        customerService.generateAndSendMailOtp(emailVerificationRequest);
        logger.info("OTP sent successfully to email: {}", emailVerificationRequest.email());
        return ResponseEntity.ok("OTP sent to email: " + emailVerificationRequest.email());
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
