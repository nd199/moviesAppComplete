package com.naren.movieticketbookingapplication.Record;

public record ProductCreateRequest(
        String name,
        Double cost,
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
