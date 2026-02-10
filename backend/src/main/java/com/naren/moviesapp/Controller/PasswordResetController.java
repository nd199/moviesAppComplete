package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Record.PasswordResetRequest;
import com.naren.moviesapp.Service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;
    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request")
    public ResponseEntity<String> requestPasswordRequest(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.<String>badRequest().body("Email is required");
        }
        passwordResetService.createPasswordResetToken(email);
        return ResponseEntity.<String>ok("Password reset mail sent");
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest passwordResetRequest) {
        passwordResetService.resetPassword(passwordResetRequest);
        return ResponseEntity.<String>ok("Password reset successful");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestParam String token) {
        if (passwordResetService.isTokenValid(token)) {
            return ResponseEntity.<String>ok("Token is valid");
        } else {
            return ResponseEntity.<String>status(400).body("Invalid or expired token");
        }
    }
}
