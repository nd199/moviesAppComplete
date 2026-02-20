package com.naren.moviesapp.Service;

import com.naren.moviesapp.Record.AdminRegistration;
import com.naren.moviesapp.Record.AdminUpdateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Set;

public interface AdminServiceInterface {

    @PreAuthorize("hasAuthority('USER_MANAGE')")
    ResponseEntity<?> registerAdmin(AdminRegistration registration, Set<String> roleNames);

    @PreAuthorize("hasAuthority('USER_MANAGE')")
    ResponseEntity<?> updateAdmin(Long adminId, AdminUpdateRequest updateRequest);

    @PreAuthorize("hasAuthority('USER_MANAGE')")
    ResponseEntity<?> deleteAdmin(Long adminId);

    @PreAuthorize("hasAuthority('USER_READ')")
    ResponseEntity<?> getAdminById(Long adminId);

    @PreAuthorize("hasAuthority('USER_READ')")
    ResponseEntity<?> getAdminByEmail(String email);

    @PreAuthorize("hasAuthority('USER_READ')")
    ResponseEntity<?> getAllAdmins();

    @PreAuthorize("hasAuthority('USER_READ')")
    ResponseEntity<?> getActiveAdmins();

    @PreAuthorize("hasAuthority('USER_READ')")
    ResponseEntity<?> getAdminsByDepartment(String department);

    @PreAuthorize("hasAuthority('USER_READ')")
    ResponseEntity<?> getAdminStats();

    @PreAuthorize("hasAuthority('USER_MANAGE')")
    ResponseEntity<?> toggleAdminStatus(Long adminId);
}
