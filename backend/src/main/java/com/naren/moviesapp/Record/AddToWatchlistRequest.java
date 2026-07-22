package com.naren.moviesapp.Record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddToWatchlistRequest(
    @NotNull Long tmdbId,
    @NotBlank String title,
    String posterPath,
    @NotBlank String mediaType
) {}
