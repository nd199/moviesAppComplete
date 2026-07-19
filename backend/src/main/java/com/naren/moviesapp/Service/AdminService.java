package com.naren.moviesapp.Service;

import com.naren.moviesapp.Config.RoleHierarchyPolicy;
import com.naren.moviesapp.Dto.AdminDTO;
import com.naren.moviesapp.Dto.AdminDTOMapper;
import com.naren.moviesapp.Dto.AdminInviteDTO;
import com.naren.moviesapp.Dto.AdminInviteDTOMapper;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AdminService implements AdminServiceInterface {
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);
    private static final long REQ_PASSWORD_LENGTH = 8;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminDTOMapper adminDTOMapper;
    private final AdminInviteDTOMapper adminInviteDTOMapper;
    private final RoleService roleService;

    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder,
                        AdminDTOMapper adminDTOMapper, AdminInviteDTOMapper adminInviteDTOMapper,
                        RoleService roleService) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminDTOMapper = adminDTOMapper;
        this.adminInviteDTOMapper = adminInviteDTOMapper;
        this.roleService = roleService;
    }

    @Override
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

        Authentication auth = SecurityContextHolder.getContext()
                .getAuthentication();
        RoleName currentRole = extractHighestRole(auth);

        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            String normalizedRole = roleName.toUpperCase().startsWith("ROLE_")
                    ? roleName.toUpperCase()
                    : "ROLE_" + roleName.toUpperCase();
            RoleName targetRole = RoleName.valueOf(normalizedRole);

            if (!RoleHierarchyPolicy.canAssign(currentRole, targetRole)) {
                throw new AccessDeniedException("Cannot assign role: " + targetRole);
            }

            Role role = roleService.findRoleByName(targetRole);
            roles.add(role);
        }
        admin.setRoles(roles);

        Admin savedAdmin = adminRepository.save(admin);
        logger.info("Successfully registered admin with ID: {}", savedAdmin.getId());

        return new ResponseEntity<>(adminDTOMapper.apply(savedAdmin), HttpStatus.CREATED);
    }

    @Override
    @Transactional
    public ResponseEntity<?> updateAdmin(Long adminId, AdminUpdateRequest updateRequest) {
        logger.info("Updating admin with ID: {}", adminId);

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + adminId));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        RoleName currentRole = extractHighestRole(auth);

        RoleName targetRole = extractTargetRole(admin);

        if (!RoleHierarchyPolicy.canModify(currentRole, targetRole)) {
            throw new AccessDeniedException("Insufficient privilege to modify this user.");
        }


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
    @Transactional
    public ResponseEntity<?> deleteAdmin(Long adminId) {
        logger.info("Deleting admin with ID: {}", adminId);

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + adminId));

        Authentication auth = SecurityContextHolder.getContext()
                .getAuthentication();
        RoleName currentRole = extractHighestRole(auth);
        RoleName targetRole = extractTargetRole(admin);

        if (!RoleHierarchyPolicy.canModify(currentRole, targetRole)) {
            throw new AccessDeniedException("Insufficient privilege to delete this user.");
        }

        long count = roleService.findRoleByName(RoleName.ROLE_SUPER_ADMIN)
                .getAdmins().size();
        if (count <= 1) {
            throw new AccessDeniedException("Cannot delete the last SuperAdmin.");
        }

        adminRepository.delete(admin);
        logger.info("Successfully deleted admin with ID: {}", adminId);

        return new ResponseEntity<>("Admin deleted successfully", HttpStatus.OK);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAdminById(Long adminId) {
        logger.info("Fetching admin with ID: {}", adminId);

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + adminId));

        return new ResponseEntity<>(adminDTOMapper.apply(admin), HttpStatus.OK);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAdminByEmail(String email) {
        logger.info("Fetching admin with email: {}", email);

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with email: " + email));

        return new ResponseEntity<>(adminDTOMapper.apply(admin), HttpStatus.OK);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllAdmins() {
        logger.info("Fetching all admins");

        List<Admin> admins = adminRepository.findAll();
        List<AdminDTO> adminDTOs = admins.stream()
                .map(adminDTOMapper)
                .toList();

        return new ResponseEntity<>(adminDTOs, HttpStatus.OK);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> getActiveAdmins() {
        logger.info("Fetching all active admins");

        List<Admin> admins = adminRepository.getAdminsByIsActive(true);
        List<AdminDTO> adminDTOs = admins.stream()
                .map(adminDTOMapper)
                .toList();

        return new ResponseEntity<>(adminDTOs, HttpStatus.OK);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAdminsByDepartment(String department) {
        logger.info("Fetching admins by department: {}", department);

        List<Admin> admins = adminRepository.findByDepartment(department);
        List<AdminDTO> adminDTOs = admins.stream()
                .map(adminDTOMapper)
                .toList();

        return new ResponseEntity<>(adminDTOs, HttpStatus.OK);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAdminStats() {
        logger.info("Fetching admin statistics");

        long totalAdmins = adminRepository.count();
        long activeAdmins = adminRepository.countActiveAdmins();
        List<Object[]> departmentStats = adminRepository.getAdminCountByDepartment();

        AdminStatsDTO stats = new AdminStatsDTO(totalAdmins, activeAdmins, departmentStats);

        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @Override
    @Transactional
    public ResponseEntity<?> toggleAdminStatus(Long adminId) {
        logger.info("Toggling status for admin with ID: {}", adminId);

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + adminId));

        Authentication auth = SecurityContextHolder.getContext()
                .getAuthentication();
        RoleName currentRole = extractHighestRole(auth);
        RoleName targetRole = extractTargetRole(admin);

        if (!RoleHierarchyPolicy.canModify(currentRole, targetRole)) {
            throw new AccessDeniedException("Insufficient privilege to toggle this user's status.");
        }

        if (targetRole == RoleName.ROLE_SUPER_ADMIN && admin.getIsActive()) {
            long activeSuperAdminCount = roleService.findRoleByName(RoleName.ROLE_SUPER_ADMIN)
                    .getAdmins().stream()
                    .filter(Admin::getIsActive)
                    .count();

            if (activeSuperAdminCount <= 1) {
                throw new AccessDeniedException("Cannot disable the last active SuperAdmin.");
            }
        }

        admin.setIsActive(!admin.getIsActive());
        Admin updatedAdmin = adminRepository.save(admin);

        String status = updatedAdmin.getIsActive() ? "activated" : "deactivated";
        logger.info("Admin {} {}", adminId, status);

        return new ResponseEntity<>(adminDTOMapper.apply(updatedAdmin), HttpStatus.OK);
    }

    public RoleName extractHighestRole(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalArgumentException("Authentication is required");
        }

        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(r -> {
                    return r.equals("ROLE_USER") || r.equals("ROLE_ADMIN") || r.equals("ROLE_SUPER_ADMIN")
                            || r.equals("ROLE_CONTENT_MANAGER") || r.equals("ROLE_SUPPORT");
                })
                .map(r -> {
                    String normalizedRole = r.toUpperCase().startsWith("ROLE_")
                            ? r.toUpperCase()
                            : "ROLE_" + r.toUpperCase();
                    return RoleName.valueOf(normalizedRole);
                })
                .max(Comparator.comparingInt(RoleHierarchyPolicy::getLevel))
                .orElse(RoleName.ROLE_USER);
    }

    public RoleName extractTargetRole(Admin admin) {
        return admin.getRoles().stream()
                .map(Role::getName)
                .max(Comparator.comparing(RoleHierarchyPolicy::getLevel))
                .orElse(RoleName.ROLE_USER);
    }

    @Override
    @Transactional
    public AdminInviteDTO createAdmin(String name, String email, String phoneNumber,
                                      String address, String department) {
        logger.info("=== CREATE ADMIN START === email: {}", email);

        if (adminRepository.existsByEmail(email)) {
            throw new AdminAlreadyExistsException("Admin with email " + email + " already exists");
        }
        logger.info("Email check passed, no duplicate");

        Admin admin = new Admin();
        admin.setName(name);
        admin.setEmail(email);
        admin.setPhoneNumber(phoneNumber);
        admin.setAddress(address != null ? address : "");
        admin.setDepartment(department != null ? department : "Admin");
        admin.setIsActive(false);
        admin.setIsEmailVerified(true);
        admin.setAccessLevel(1);
        admin.setPassword(java.util.UUID.randomUUID().toString());

        Role adminRole = roleService.findRoleByName(RoleName.ROLE_ADMIN);
        logger.info("ROLE_ADMIN found: {}", adminRole != null);
        if (adminRole != null) {
            admin.addRole(adminRole);
        }

        logger.info("About to save admin entity");
        Admin saved = adminRepository.save(admin);
        logger.info("Admin saved with ID: {}, now flushing", saved.getId());
        adminRepository.flush();
        logger.info("Flush complete, admin ID: {}", saved.getId());

        return adminInviteDTOMapper.apply(saved);
    }

    @Override
    @Transactional
    public void updateAdminPassword(String email, String newPassword) {
        logger.info("Setting password for admin: {}", email);

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with email: " + email));

        admin.setPassword(passwordEncoder.encode(newPassword));
        admin.setIsActive(true);
        adminRepository.save(admin);

        logger.info("Admin {} password set and activated", email);
    }

}
