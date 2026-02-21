package com.naren.moviesapp.Record;

public record ProductCreateRequest(
        String name,
        Double rating,
        String description,
        String poster,
        String ageRating,
        Integer year,
        String type,
        String runtime,
        String genre
) {
}
