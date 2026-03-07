package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Record.AdminRegistration;
import com.naren.moviesapp.Service.AdminInviteService;
import com.naren.moviesapp.Service.AdminService;
import com.naren.moviesapp.Utils.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/system/superadmin")
@PreAuthorize("hasAuthority('SYSTEM_CONFIG')")
public class SuperAdminController {

    private final AdminService adminService;
    private final AdminInviteService inviteService;
    private final EmailService emailService;
    @Value("${spring.profiles.active}")
    private String activeProfile;

    public SuperAdminController(AdminService adminService, AdminInviteService inviteService, EmailService emailService) {
        this.adminService = adminService;
        this.inviteService = inviteService;
        this.emailService = emailService;
    }

    @PostMapping("/invite")
    public ResponseEntity<?> sendInvite(@RequestBody Map<String, Object> request) {
        try {
            // Extract admin details
            String name = (String) request.get("name");
            String email = (String) request.get("email");
            String phoneNumber = (String) request.get("phoneNumber");
            String address = (String) request.get("address");

            // Validate required fields
            if (!isValidEmail(email) || name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name and valid email are required"));
            }

            // Generate invite token for existing admin
            String setupToken = inviteService.generateInviteToken(email, RoleName.ROLE_ADMIN);

            // Use admin frontend URL for set-password (port 5173 for dev)
            String baseUrl = activeProfile.equals("prod") ? "https://movies-admin-one.vercel.app" : "http://localhost:5173";
            String setupLink = baseUrl + "/set-password?token=" + setupToken;

            // Send email with setup link
            emailService.sendInviteEmail(email, setupLink);

            return ResponseEntity.ok(Map.of(
                    "message", "Admin invite sent to " + email
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to send admin invite: " + e.getMessage()));
        }
    }

    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }

        // Basic email regex pattern
        String emailRegex = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$";
        return email.matches(emailRegex);
    }
}
