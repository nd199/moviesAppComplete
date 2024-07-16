package com.naren.movieticketbookingapplication.Controller;

import com.naren.movieticketbookingapplication.Record.PasswordResetRequest;
import com.naren.movieticketbookingapplication.Service.PasswordResetService;
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
            return ResponseEntity.badRequest().body("Email is required");
        }
        passwordResetService.createPasswordResetToken(email);
        return ResponseEntity.ok("Password reset mail sent");
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest passwordResetRequest) {
        passwordResetService.resetPassword(passwordResetRequest);
        return ResponseEntity.ok("Password reset successful");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestParam String token) {
        if (passwordResetService.isTokenValid(token)) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.status(400).body("Invalid or expired token");
        }
    }
}

