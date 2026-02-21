package com.naren.moviesapp.Record;

public record ShowUpdation(
        String name,
        Double rating,
        String description,
        String poster,
        String ageRating,
        Integer year,
        String runtime,
        String genre
) {
}
