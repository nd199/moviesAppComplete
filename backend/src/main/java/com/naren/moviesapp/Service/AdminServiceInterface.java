package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Record.AdminRegistration;
import com.naren.moviesapp.Record.AdminUpdateRequest;
import org.springframework.http.ResponseEntity;

import java.util.Set;

public interface AdminServiceInterface {

    ResponseEntity<?> registerAdmin(AdminRegistration registration, Set<String> roleNames);

    ResponseEntity<?> updateAdmin(Long adminId, AdminUpdateRequest updateRequest);

    ResponseEntity<?> deleteAdmin(Long adminId);

    ResponseEntity<?> getAdminById(Long adminId);

    ResponseEntity<?> getAdminByEmail(String email);

    ResponseEntity<?> getAllAdmins();

    ResponseEntity<?> getActiveAdmins();

    ResponseEntity<?> getAdminsByDepartment(String department);

    ResponseEntity<?> getAdminStats();

    ResponseEntity<?> toggleAdminStatus(Long adminId);

    String generateInviteToken(String email, RoleName roleName);
}
