package com.naren.movieticketbookingapplication.Record;


import com.naren.movieticketbookingapplication.Entity.Customer;

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
