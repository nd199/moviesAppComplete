package com.naren.moviesapp.Record;

import com.naren.moviesapp.Entity.LikeStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddToLikeRequest(
        @NotNull Long tmdbId,
        @NotBlank String title,
        @NotBlank String mediaType,
        @NotNull LikeStatus likeStatus
) {
}
