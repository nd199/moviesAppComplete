package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Service.AdminInviteService;
import com.naren.moviesapp.Service.AdminService;
import com.naren.moviesapp.Service.ContentManagerInviteService;
import com.naren.moviesapp.Service.ContentManagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class SetPasswordController {

    private static final Logger logger = LoggerFactory.getLogger(SetPasswordController.class);

    private final AdminInviteService adminInviteService;
    private final AdminService adminService;
    private final ContentManagerInviteService contentManagerInviteService;
    private final ContentManagerService contentManagerService;

    public SetPasswordController(AdminInviteService adminInviteService,
                                 AdminService adminService,
                                 ContentManagerInviteService contentManagerInviteService,
                                 ContentManagerService contentManagerService) {
        this.adminInviteService = adminInviteService;
        this.adminService = adminService;
        this.contentManagerInviteService = contentManagerInviteService;
        this.contentManagerService = contentManagerService;
    }

    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String password = request.get("password");
            String confirmPassword = request.get("confirmPassword");

            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Token is required"));
            }

            if (password == null || password.length() < 8) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 8 characters"));
            }

            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Passwords do not match"));
            }

            boolean isAdminToken = adminInviteService.validateInviteToken(token);
            boolean isContentManagerToken = contentManagerInviteService.validateInviteToken(token);

            if (!isAdminToken && !isContentManagerToken) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired invitation token"));
            }

            String email;
            if (isAdminToken) {
                email = adminInviteService.getEmailFromToken(token);
                adminService.updateAdminPassword(email, password);
                adminInviteService.consumeInviteToken(token);
                logger.info("Admin password set for: {}", email);
            } else {
                email = contentManagerInviteService.getEmailFromToken(token);
                contentManagerService.updateContentManagerPassword(email, password);
                contentManagerInviteService.consumeInviteToken(token);
                logger.info("Content manager password set for: {}", email);
            }

            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            logger.error("Failed to set password", e);
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to update password: " + e.getMessage()));
        }
    }
}
