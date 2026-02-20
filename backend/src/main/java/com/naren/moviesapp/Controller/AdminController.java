package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Record.AdminRegistration;
import com.naren.moviesapp.Record.AdminUpdateRequest;
import com.naren.moviesapp.Service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody AdminRegistration registration,
                                           @RequestParam Set<String> roles) {
        return adminService.registerAdmin(registration, roles);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAdminByEmail(@PathVariable String email) {
        return adminService.getAdminByEmail(email);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @GetMapping("/active")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getActiveAdmins() {
        return adminService.getActiveAdmins();
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAdminsByDepartment(@PathVariable String department) {
        return adminService.getAdminsByDepartment(department);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAdminStats() {
        return adminService.getAdminStats();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id,
                                         @Valid @RequestBody AdminUpdateRequest updateRequest) {
        return adminService.updateAdmin(id, updateRequest);
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    public ResponseEntity<?> toggleAdminStatus(@PathVariable Long id) {
        return adminService.toggleAdminStatus(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        return adminService.deleteAdmin(id);
    }
}
