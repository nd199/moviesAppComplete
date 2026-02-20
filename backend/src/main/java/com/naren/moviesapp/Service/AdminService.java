package com.naren.moviesapp.Service;

import com.naren.moviesapp.Dto.AdminDTO;
import com.naren.moviesapp.Dto.AdminDTOMapper;
import com.naren.moviesapp.Dto.AdminStatsDTO;
import com.naren.moviesapp.Entity.Admin;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Exception.AdminAlreadyExistsException;
import com.naren.moviesapp.Exception.AdminNotFoundException;
import com.naren.moviesapp.Exception.PasswordInvalidException;
import com.naren.moviesapp.Record.AdminRegistration;
import com.naren.moviesapp.Record.AdminUpdateRequest;
import com.naren.moviesapp.Repo.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AdminService implements AdminServiceInterface {
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);
    private static final long REQ_PASSWORD_LENGTH = 8;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminDTOMapper adminDTOMapper;
    private final RoleService roleService;

    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder,
                        AdminDTOMapper adminDTOMapper, RoleService roleService) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminDTOMapper = adminDTOMapper;
        this.roleService = roleService;
    }

    @Override
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    @Transactional
    public ResponseEntity<?> registerAdmin(AdminRegistration registration, Set<String> roleNames) {
        logger.info("Registering new admin with email: {}", registration.email());

        if (adminRepository.existsByEmail(registration.email())) {
            throw new AdminAlreadyExistsException("Admin with email " + registration.email() + " already exists");
        }

        if (adminRepository.existsByPhoneNumber(registration.phoneNumber())) {
            throw new AdminAlreadyExistsException("Admin with phone number " + registration.phoneNumber() + " already exists");
        }

        if (registration.password().length() < REQ_PASSWORD_LENGTH) {
            throw new PasswordInvalidException("Password must be at least " + REQ_PASSWORD_LENGTH + " characters long");
        }

        Admin admin = new Admin();
        admin.setName(registration.name());
        admin.setEmail(registration.email());
        admin.setPassword(passwordEncoder.encode(registration.password()));
        admin.setPhoneNumber(registration.phoneNumber());
        admin.setAddress(registration.address());
        admin.setDepartment(registration.department());
        admin.setAccessLevel(registration.accessLevel() != null ? registration.accessLevel() : 1);
        admin.setIsEmailVerified(false);
        admin.setIsActive(true);

        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            Role role = roleService.findRoleByName(RoleName.valueOf(roleName));
            roles.add(role);
        }
        admin.setRoles(roles);

        Admin savedAdmin = adminRepository.save(admin);
        logger.info("Successfully registered admin with ID: {}", savedAdmin.getId());

        return new ResponseEntity<>(adminDTOMapper.apply(savedAdmin), HttpStatus.CREATED);
    }

    @Override
    @PreAuthorize("hasAuthority('USER_MANAGE') or #adminId == authentication.principal.id")
    @Transactional
    public ResponseEntity<?> updateAdmin(Long adminId, AdminUpdateRequest updateRequest) {
        logger.info("Updating admin with ID: {}", adminId);

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + adminId));

        if (updateRequest.name() != null) {
            admin.setName(updateRequest.name());
        }
        if (updateRequest.phoneNumber() != null) {
            if (!admin.getPhoneNumber().equals(updateRequest.phoneNumber()) &&
                    adminRepository.existsByPhoneNumber(updateRequest.phoneNumber())) {
                throw new AdminAlreadyExistsException("Phone number already exists");
            }
            admin.setPhoneNumber(updateRequest.phoneNumber());
        }
        if (updateRequest.address() != null) {
            admin.setAddress(updateRequest.address());
        }
        if (updateRequest.department() != null) {
            admin.setDepartment(updateRequest.department());
        }
        if (updateRequest.accessLevel() != null) {
            admin.setAccessLevel(updateRequest.accessLevel());
        }
        if (updateRequest.isActive() != null) {
            admin.setIsActive(updateRequest.isActive());
        }
        if (updateRequest.imageUrl() != null) {
            admin.setImageUrl(updateRequest.imageUrl());
        }

        Admin updatedAdmin = adminRepository.save(admin);
        logger.info("Successfully updated admin with ID: {}", adminId);

        return new ResponseEntity<>(adminDTOMapper.apply(updatedAdmin), HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    @Transactional
    public ResponseEntity<?> deleteAdmin(Long adminId) {
        logger.info("Deleting admin with ID: {}", adminId);

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + adminId));

        adminRepository.delete(admin);
        logger.info("Successfully deleted admin with ID: {}", adminId);

        return new ResponseEntity<>("Admin deleted successfully", HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAuthority('USER_READ') or #adminId == authentication.principal.id")
    public ResponseEntity<?> getAdminById(Long adminId) {
        logger.info("Fetching admin with ID: {}", adminId);

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + adminId));

        return new ResponseEntity<>(adminDTOMapper.apply(admin), HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAuthority('USER_READ') or #email == authentication.principal.username")
    public ResponseEntity<?> getAdminByEmail(String email) {
        logger.info("Fetching admin with email: {}", email);

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with email: " + email));

        return new ResponseEntity<>(adminDTOMapper.apply(admin), HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAllAdmins() {
        logger.info("Fetching all admins");

        List<Admin> admins = adminRepository.findAll();
        List<AdminDTO> adminDTOs = admins.stream()
                .map(adminDTOMapper)
                .toList();

        return new ResponseEntity<>(adminDTOs, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getActiveAdmins() {
        logger.info("Fetching all active admins");

        List<Admin> admins = adminRepository.getAdminsByIsActive(true);
        List<AdminDTO> adminDTOs = admins.stream()
                .map(adminDTOMapper)
                .toList();

        return new ResponseEntity<>(adminDTOs, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getAdminsByDepartment(String department) {
        logger.info("Fetching admins by department: {}", department);

        List<Admin> admins = adminRepository.findByDepartment(department);
        List<AdminDTO> adminDTOs = admins.stream()
                .map(adminDTOMapper)
                .toList();

        return new ResponseEntity<>(adminDTOs, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<?> getAdminStats() {
        logger.info("Fetching admin statistics");

        long totalAdmins = adminRepository.count();
        long activeAdmins = adminRepository.countActiveAdmins();
        List<Object[]> departmentStats = adminRepository.getAdminCountByDepartment();

        AdminStatsDTO stats = new AdminStatsDTO(totalAdmins, activeAdmins, departmentStats);

        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    @Transactional
    public ResponseEntity<?> toggleAdminStatus(Long adminId) {
        logger.info("Toggling status for admin with ID: {}", adminId);

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + adminId));

        admin.setIsActive(!admin.getIsActive());
        Admin updatedAdmin = adminRepository.save(admin);

        String status = updatedAdmin.getIsActive() ? "activated" : "deactivated";
        logger.info("Admin {} {}", adminId, status);

        return new ResponseEntity<>(adminDTOMapper.apply(updatedAdmin), HttpStatus.OK);
    }
}
