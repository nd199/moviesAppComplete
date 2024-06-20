package com.naren.movieticketbookingapplication.Record;

public record ProductUpdateRequest(
        String name,
        Double cost,
        Double rating,
        Integer productId,
        String description,
        String poster,
        String ageRating,
        Integer year,
        String runtime,
        String genre
) {
}
