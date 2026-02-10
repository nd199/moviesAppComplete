package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Movie;

import java.time.LocalDateTime;
import java.util.List;

public record CustomerDTO(
        Long id,
        String name,
        String email,
        Long phoneNumber,
        String imageUrl,
        Boolean isEmailVerified,
        String address,
        Boolean isLogged,
        Boolean isRegistered,
        Boolean isSubscribed,
        List<Movie> movies,
        List<String> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Customer user
) {
}
