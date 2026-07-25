package com.naren.moviesapp.Record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RecordViewRequest(
    @NotNull Long tmdbId,
    @NotBlank String mediaType,
    String title,
    String posterPath
) {}
