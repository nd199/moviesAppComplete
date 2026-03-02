package com.naren.moviesapp.Dto;

import java.time.LocalDateTime;
import java.util.Set;

public record ContentManagerDTO(
        Long id,
        String name,
        String email,
        String phoneNumber,
        String department,
        String specialization,
        Boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String imageUrl,
        Set<String> roles
) {
}
