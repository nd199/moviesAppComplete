package com.naren.movieticketbookingapplication.Dto;

import com.naren.movieticketbookingapplication.Entity.Movie;

import java.time.LocalDateTime;
import java.util.List;

public record CustomerDTO(
        Long id,
        String name,
        String email,
        List<String> roles,
        Long phoneNumber,
        List<Movie> movies,
        Boolean isEmailVerified,
        String address,
        Boolean isLogged,
        Boolean isRegistered,
        Boolean isSubscribed,
        String imageUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
