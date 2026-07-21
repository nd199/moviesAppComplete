package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.AdminUserDTO;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasAuthority('USER_READ')")
public class AdminUserController {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserController.class);

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;

    public AdminUserController(AdminRepository adminRepository, CustomerRepository customerRepository) {
        this.adminRepository = adminRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        logger.debug("Fetching all users (admins + customers)");

        List<AdminUserDTO> allUsers = new ArrayList<>();

        adminRepository.findAll().forEach(admin -> {
            List<String> roleNames = admin.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList());

            allUsers.add(new AdminUserDTO(
                    admin.getId(),
                    admin.getName(),
                    admin.getEmail(),
                    admin.getPhoneNumber(),
                    admin.getImageUrl(),
                    admin.getIsEmailVerified(),
                    admin.getAddress(),
                    admin.getIsActive(),
                    "ADMIN",
                    roleNames,
                    admin.getCreatedAt(),
                    admin.getUpdatedAt()
            ));
        });

        customerRepository.findAll().forEach(customer -> {
            List<String> roleNames = customer.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList());

            allUsers.add(new AdminUserDTO(
                    customer.getId(),
                    customer.getName(),
                    customer.getEmail(),
                    customer.getPhoneNumber(),
                    customer.getImageUrl(),
                    customer.getIsEmailVerified(),
                    customer.getAddress(),
                    customer.getIsActive(),
                    "CUSTOMER",
                    roleNames,
                    customer.getCreatedAt(),
                    customer.getUpdatedAt()
            ));
        });

        return ResponseEntity.ok(allUsers);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        logger.debug("Fetching user by ID: {}", id);

        var admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            var a = admin.get();
            List<String> roleNames = a.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new AdminUserDTO(
                    a.getId(), a.getName(), a.getEmail(), a.getPhoneNumber(),
                    a.getImageUrl(), a.getIsEmailVerified(), a.getAddress(),
                    a.getIsActive(), "ADMIN", roleNames, a.getCreatedAt(), a.getUpdatedAt()
            ));
        }

        var customer = customerRepository.findById(id);
        if (customer.isPresent()) {
            var c = customer.get();
            List<String> roleNames = c.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new AdminUserDTO(
                    c.getId(), c.getName(), c.getEmail(), c.getPhoneNumber(),
                    c.getImageUrl(), c.getIsEmailVerified(), c.getAddress(),
                    c.getIsActive(), "CUSTOMER", roleNames, c.getCreatedAt(), c.getUpdatedAt()
            ));
        }

        return ResponseEntity.notFound().build();
    }
}
