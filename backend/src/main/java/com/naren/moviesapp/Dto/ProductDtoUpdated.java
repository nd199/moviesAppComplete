package com.naren.moviesapp.Dto;

public record ProductDtoUpdated(
        String name,
        Double cost,
        Double rating,
        String description,
        String poster,
        String ageRating,
        Integer year,
        String runtime,
        String genre
) {
}
