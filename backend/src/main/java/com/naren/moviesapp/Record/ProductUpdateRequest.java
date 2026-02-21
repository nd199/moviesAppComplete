package com.naren.moviesapp.Record;

public record ProductUpdateRequest(
        String name,
        Double rating,
        Integer entityId,
        String description,
        String poster,
        String ageRating,
        Integer year,
        String runtime,
        String genre,
        String category
) {
}
