package com.naren.moviesapp.Dto;

import java.time.LocalDateTime;
import java.util.List;

public record AdminUserDTO(
        Long id,
        String name,
        String email,
        String phoneNumber,
        String imageUrl,
        Boolean isEmailVerified,
        String address,
        Boolean isActive,
        String userType,
        List<String> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
