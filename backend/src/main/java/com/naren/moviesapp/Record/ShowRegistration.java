package com.naren.moviesapp.Record;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ShowRegistration(
        @NotBlank String name,
        @NotNull @Min(0) Double rating,
        String description,
        String poster,
        String ageRating,
        @NotNull Integer year,
        String runtime,
        String genre,
        String category
) {
}
