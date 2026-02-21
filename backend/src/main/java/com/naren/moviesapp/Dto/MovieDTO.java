package com.naren.moviesapp.Dto;

import java.time.LocalDateTime;

public record MovieDTO(
        Long id,
        String name,
        Double rating,
        String description,
        String poster,
        String ageRating,
        Integer year,
        String runtime,
        String genre,
        String type,
        Long customerId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
