package com.naren.moviesapp.Dto;

import java.time.LocalDateTime;
import java.util.List;

public record CustomerDTO(
        Long id,
        String name,
        String email,
        String phoneNumber,
        String imageUrl,
        Boolean isEmailVerified,
        String address,
        Boolean isSubscribed,
        List<String> roles,  // Keep roles - needed by frontend and AuthService
        LocalDateTime createdAt,
        LocalDateTime updatedAt
        // Removed: List<Movie> movies (never used)
        // Removed: Customer user (circular reference)
) {
}
