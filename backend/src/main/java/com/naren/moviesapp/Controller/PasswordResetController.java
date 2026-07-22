package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Record.PasswordResetRequest;
import com.naren.moviesapp.Service.PasswordResetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetController.class);

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request")
    public ResponseEntity<String> requestPasswordRequest(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        logger.info("Password reset requested for email: {}", email);
        if (email == null || email.isEmpty()) {
            logger.warn("Password reset request failed: Email is required");
            return ResponseEntity.<String>badRequest().body("Email is required");
        }
        passwordResetService.createPasswordResetToken(email);
        logger.info("Password reset token created for email: {}", email);
        return ResponseEntity.<String>ok("Password reset mail sent");
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordResetRequest passwordResetRequest) {
        logger.info("Password reset attempt with token");
        passwordResetService.resetPassword(passwordResetRequest);
        logger.info("Password reset successful");
        return ResponseEntity.<String>ok("Password reset successful");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestParam String token) {
        logger.debug("Validating password reset token");
        if (passwordResetService.isTokenValid(token)) {
            logger.debug("Token is valid");
            return ResponseEntity.<String>ok("Token is valid");
        } else {
            logger.warn("Invalid or expired token");
            return ResponseEntity.<String>status(400).body("Invalid or expired token");
        }
    }
}
