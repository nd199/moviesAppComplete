package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Service.AdminInviteService;
import com.naren.moviesapp.Service.AdminService;
import com.naren.moviesapp.Service.ContentManagerInviteService;
import com.naren.moviesapp.Service.ContentManagerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class SetPasswordController {

    private final AdminInviteService inviteService;
    private final AdminService adminService;
    private final ContentManagerInviteService contentManagerInviteService;
    private final ContentManagerService contentManagerService;

    public SetPasswordController(AdminInviteService inviteService, 
                                AdminService adminService,
                                ContentManagerInviteService contentManagerInviteService,
                                ContentManagerService contentManagerService) {
        this.inviteService = inviteService;
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
            String type = request.get("type"); // "admin" or "content-manager"

            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Token is required"));
            }

            if (password == null || password.length() < 8) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 8 characters"));
            }

            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Passwords do not match"));
            }

            // Check if it's a content manager invite token or admin invite token
            boolean isAdminToken = inviteService.validateInviteToken(token);
            boolean isContentManagerToken = contentManagerInviteService.validateInviteToken(token);

            if (!isAdminToken && !isContentManagerToken) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired invitation token"));
            }

            String email;
            if (isContentManagerToken) {
                email = contentManagerInviteService.getEmailFromToken(token);
                // Update content manager's password
                contentManagerService.updateContentManagerPassword(email, password);
                // Consume the invite token
                contentManagerInviteService.consumeInviteToken(token);
            } else {
                email = inviteService.getEmailFromToken(token);
                // Update admin's password
                adminService.updateAdminPassword(email, password);
                // Consume the invite token
                inviteService.consumeInviteToken(token);
            }

            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to update password: " + e.getMessage()));
        }
    }
}
