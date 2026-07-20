package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.AdminDTO;
import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Record.PasswordChangeRequest;
import com.naren.moviesapp.Service.AdminService;
import com.naren.moviesapp.Service.CustomerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/profile")
@Tag(name = "Profile Management", description = "User profile management APIs")
public class ProfileController {

    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);

    private final CustomerService customerService;
    private final AdminService adminService;

    public ProfileController(CustomerService customerService, AdminService adminService) {
        this.customerService = customerService;
        this.adminService = adminService;
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Fetching current user profile: {}", userDetails.getUsername());
        String username = userDetails.getUsername();
        
        // First try to find as Customer
        try {
            CustomerDTO customerDTO = customerService.getCustomerByEmail(username);
            return new ResponseEntity<>(customerDTO, HttpStatus.OK);
        } catch (Exception e) {
            // If not found as customer, try as Admin
            logger.debug("User {} not found as customer, trying as admin", username);
            try {
                ResponseEntity<?> adminResponse = adminService.getAdminByEmail(username);
                return adminResponse;
            } catch (Exception ex) {
                logger.error("User {} not found in either customer or admin tables", username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }
        }
    }

    @PutMapping("/current")
    public ResponseEntity<CustomerDTO> updateCurrentUserProfile(
            @Valid @RequestBody CustomerUpdateRequest customerUpdateRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Updating profile for current user: {}", userDetails.getUsername());

        // Get current user by email
        CustomerDTO currentCustomer = customerService.getCustomerByEmail(userDetails.getUsername());

        // Update the customer profile
        CustomerDTO updatedCustomer = customerService.updateCustomer(customerUpdateRequest, currentCustomer.id());

        return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
    }

    @PutMapping("/current/password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody PasswordChangeRequest passwordChangeRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Password change request for user: {}", userDetails.getUsername());

        try {
            String email = userDetails.getUsername();

            // Try customer first, then admin
            if (customerService.existsByEmail(email)) {
                customerService.updatePasswordWithValidation(
                        email,
                        passwordChangeRequest.currentPassword(),
                        passwordChangeRequest.newPassword()
                );
            } else if (adminService.adminExistsByEmail(email)) {
                adminService.updateAdminPasswordWithValidation(
                        email,
                        passwordChangeRequest.currentPassword(),
                        passwordChangeRequest.newPassword()
                );
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "User not found",
                        "status", "error"
                ));
            }

            return ResponseEntity.ok().body(Map.of(
                    "message", "Password changed successfully",
                    "status", "success"
            ));
        } catch (Exception e) {
            logger.error("Password change failed for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "status", "error"
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getProfileById(@PathVariable("id") Long customerId) {
        logger.debug("Fetching profile by ID: {}", customerId);
        CustomerDTO customerDTO = customerService.getCustomerById(customerId);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }
}
