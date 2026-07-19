package com.naren.moviesapp.Dto;

import java.time.LocalDateTime;

public record AdminInviteDTO(
        Long id,
        String name,
        String email,
        String department,
        Boolean isActive,
        LocalDateTime createdAt
) {
}
