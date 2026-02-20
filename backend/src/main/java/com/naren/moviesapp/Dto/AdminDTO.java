package com.naren.moviesapp.Dto;

import java.time.LocalDateTime;
import java.util.List;

public record AdminDTO(
        Long id,
        String name,
        String email,
        String phoneNumber,
        String imageUrl,
        Boolean isEmailVerified,
        String address,
        String department,
        Integer accessLevel,
        Boolean isActive,
        List<RoleDTO> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
