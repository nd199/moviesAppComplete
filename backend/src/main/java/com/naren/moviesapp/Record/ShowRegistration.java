package com.naren.moviesapp.Record;

public record ShowRegistration(
        String name,
        Double rating,
        String description,
        String poster,
        String ageRating,
        Integer year,
        String runtime,
        String genre,
        String category
) {
}
