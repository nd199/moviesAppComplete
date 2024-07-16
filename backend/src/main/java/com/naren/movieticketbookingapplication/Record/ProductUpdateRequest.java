package com.naren.movieticketbookingapplication.Record;

public record ProductUpdateRequest(
        String name,
        Double cost,
        Double rating,
        Integer entityId,
        String description,
        String poster,
        String ageRating,
        Integer year,
        String runtime,
        String genre
) {
}
