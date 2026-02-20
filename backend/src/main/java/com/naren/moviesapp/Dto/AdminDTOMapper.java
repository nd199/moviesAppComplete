package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Admin;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class AdminDTOMapper implements Function<Admin, AdminDTO> {

    @Override
    public AdminDTO apply(Admin admin) {
        return new AdminDTO(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getPhoneNumber(),
                admin.getImageUrl(),
                admin.getIsEmailVerified(),
                admin.getAddress(),
                admin.getDepartment(),
                admin.getAccessLevel(),
                admin.getIsActive(),
                admin.getRoles().stream()
                        .map(role -> new RoleDTO(role.getId(), role.getName()))
                        .toList(),
                admin.getCreatedAt(),
                admin.getUpdatedAt()
        );
    }
}
