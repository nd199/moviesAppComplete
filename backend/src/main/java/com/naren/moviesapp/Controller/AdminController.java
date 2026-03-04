package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Record.AdminRegistration;
import com.naren.moviesapp.Record.AdminUpdateRequest;
import com.naren.moviesapp.Record.ContentManagerRegistration;
import com.naren.moviesapp.Service.AdminService;
import com.naren.moviesapp.Service.ContentManagerInviteService;
import com.naren.moviesapp.Service.ContentManagerService;
import com.naren.moviesapp.Utils.EmailService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/admins")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;
    private final ContentManagerService contentManagerService;
    private final ContentManagerInviteService contentManagerInviteService;
    private final EmailService emailService;
    @Value("${spring.profiles.active}")
    private String activeProfile;

    public AdminController(AdminService adminService,
                           ContentManagerService contentManagerService,
                           ContentManagerInviteService contentManagerInviteService,
                           EmailService emailService) {
        this.adminService = adminService;
        this.contentManagerService = contentManagerService;
        this.contentManagerInviteService = contentManagerInviteService;
        this.emailService = emailService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody AdminRegistration registration,
                                           @RequestParam Set<String> roles) {
        logger.info("Registering new admin with email: {}", registration.email());
        return adminService.registerAdmin(registration, roles);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        logger.debug("Fetching admin by ID: {}", id);
        return adminService.getAdminById(id);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAdminByEmail(@PathVariable String email) {
        logger.debug("Fetching admin by email: {}", email);
        return adminService.getAdminByEmail(email);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAllAdmins() {
        logger.debug("Fetching all admins");
        return adminService.getAllAdmins();
    }

    @GetMapping("/active")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getActiveAdmins() {
        logger.debug("Fetching active admins");
        return adminService.getActiveAdmins();
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAdminsByDepartment(@PathVariable String department) {
        logger.debug("Fetching admins by department: {}", department);
        return adminService.getAdminsByDepartment(department);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAdminStats() {
        logger.debug("Fetching admin statistics");
        return adminService.getAdminStats();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id,
                                         @Valid @RequestBody AdminUpdateRequest updateRequest) {
        logger.info("Updating admin with ID: {}", id);
        return adminService.updateAdmin(id, updateRequest);
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    public ResponseEntity<?> toggleAdminStatus(@PathVariable Long id) {
        logger.info("Toggling status for admin with ID: {}", id);
        return adminService.toggleAdminStatus(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        logger.info("Deleting admin with ID: {}", id);
        return adminService.deleteAdmin(id);
    }

    @PostMapping("/invite-content-manager")
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    public ResponseEntity<?> inviteContentManager(@RequestBody Map<String, Object> request) {
        try {
            // Extract content manager details
            String name = (String) request.get("name");
            String email = (String) request.get("email");
            String phoneNumber = (String) request.get("phoneNumber");
            String department = (String) request.get("department");
            String specialization = (String) request.get("specialization");

            // Validate required fields
            if (!isValidEmail(email) || name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name and valid email are required"));
            }

            // Create content manager account immediately with temporary password
            String tempPassword = "TempPass123!" + System.currentTimeMillis();
            ContentManagerRegistration registration = new ContentManagerRegistration(
                    name, email, tempPassword, phoneNumber, department, specialization
            );

            contentManagerService.register(registration);

            // Generate setup token for password change
            String setupToken = contentManagerInviteService.generateInviteToken(email, RoleName.ROLE_CONTENT_MANAGER);

            // Use admin frontend URL for set-password (port 5173 for dev)
            String baseUrl = activeProfile.equals("prod") ? "https://movies-admin-one.vercel.app" : "http://localhost:5173";
            String setupLink = baseUrl + "/set-password?token=" + setupToken + "&type=content-manager";

            // Send email with setup link
            emailService.sendContentManagerInviteEmail(email, setupLink);

            return ResponseEntity.ok(Map.of(
                    "message", "Content manager account created and invite sent to " + email
            ));
        } catch (Exception e) {
            logger.error("Failed to invite content manager", e);
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create content manager: " + e.getMessage()));
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
