package com.naren.movieticketbookingapplication.Record;

public record MovieUpdation(
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
