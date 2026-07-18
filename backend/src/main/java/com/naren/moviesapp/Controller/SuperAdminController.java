package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Admin;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Record.AdminRegistration;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Service.AdminInviteService;
import com.naren.moviesapp.Service.AdminService;
import com.naren.moviesapp.Service.RoleService;
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
    private final AdminRepository adminRepository;
    private final RoleService roleService;
    private final EmailService emailService;
    @Value("${spring.profiles.active}")
    private String activeProfile;

    public SuperAdminController(AdminService adminService, AdminInviteService inviteService,
                                 AdminRepository adminRepository, RoleService roleService,
                                 EmailService emailService) {
        this.adminService = adminService;
        this.inviteService = inviteService;
        this.adminRepository = adminRepository;
        this.roleService = roleService;
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
            String department = (String) request.get("department");

            // Validate required fields
            if (!isValidEmail(email) || name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name and valid email are required"));
            }

            // Check if admin already exists
            if (adminRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Admin with email " + email + " already exists"));
            }

            // Create the admin record in DB (inactive until password is set)
            Admin admin = new Admin();
            admin.setName(name);
            admin.setEmail(email);
            admin.setPhoneNumber(phoneNumber);
            admin.setAddress(address != null ? address : "");
            admin.setDepartment(department != null ? department : "Admin");
            admin.setIsActive(false); // dormant until password is set
            admin.setIsEmailVerified(true);
            admin.setAccessLevel(1);
            admin.setPassword(java.util.UUID.randomUUID().toString()); // placeholder; login blocked by isActive=false

            Role adminRole = roleService.findRoleByName(RoleName.ROLE_ADMIN);
            if (adminRole != null) {
                admin.addRole(adminRole);
            }

            adminRepository.save(admin);
            logger.info("Admin stub created for invite: {}", email);

            // Generate invite token
            String setupToken = inviteService.generateInviteToken(email, RoleName.ROLE_ADMIN);

            // Use merged frontend URL for set-password
            String baseUrl = activeProfile.equals("prod") ? "https://movies-app-complete.vercel.app" : "http://localhost:3000";
            String setupLink = baseUrl + "/admin/set-password?token=" + setupToken;

            // Send email with setup link
            emailService.sendInviteEmail(email, setupLink);

            return ResponseEntity.ok(Map.of(
                    "message", "Admin invite sent to " + email
            ));
        } catch (Exception e) {
            logger.error("Failed to send admin invite", e);
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
