package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.AdminInviteDTO;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Service.AdminInviteService;
import com.naren.moviesapp.Service.AdminService;
import com.naren.moviesapp.Utils.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/system/superadmin")
@PreAuthorize("hasAuthority('SYSTEM_CONFIG')")
public class SuperAdminController {

    private static final Logger logger = LoggerFactory.getLogger(SuperAdminController.class);

    private final AdminService adminService;
    private final AdminInviteService inviteService;
    private final EmailService emailService;
    @Value("${spring.profiles.active}")
    private String activeProfile;

    public SuperAdminController(AdminService adminService, AdminInviteService inviteService,
                                 EmailService emailService) {
        this.adminService = adminService;
        this.inviteService = inviteService;
        this.emailService = emailService;
    }

    @PostMapping("/invite")
    public ResponseEntity<?> sendInvite(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String email = (String) request.get("email");
            String phoneNumber = (String) request.get("phoneNumber");
            String address = (String) request.get("address");
            String department = (String) request.get("department");

            logger.info("=== INVITE START === email: {}", email);

            if (!isValidEmail(email) || name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name and valid email are required"));
            }

            logger.info("Step 1: Creating admin...");
            AdminInviteDTO admin = adminService.createAdmin(name, email, phoneNumber, address, department);
            logger.info("Step 1 done: admin created with id {}", admin.id());

            logger.info("Step 2: Generating invite token...");
            String setupToken = inviteService.generateInviteToken(email, RoleName.ROLE_ADMIN);
            logger.info("Step 2 done: token generated");

            String baseUrl = activeProfile.equals("prod") ? "https://movies-app-complete.vercel.app" : "http://localhost:3000";
            String setupLink = baseUrl + "/admin/set-password?token=" + setupToken;

            logger.info("Step 3: Sending invite email...");
            emailService.sendInviteEmail(email, setupLink);
            logger.info("Step 3 done: email sent");

            return ResponseEntity.ok(Map.of(
                    "message", "Admin invite sent to " + email,
                    "admin", admin
            ));
        } catch (Exception e) {
            logger.error("=== INVITE FAILED === {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to send admin invite: " + e.getMessage()));
        }
    }

    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        String emailRegex = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$";
        return email.matches(emailRegex);
    }
}
