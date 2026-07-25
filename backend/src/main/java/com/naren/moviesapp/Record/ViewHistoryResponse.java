package com.naren.moviesapp.Record;

import java.time.LocalDateTime;

public record ViewHistoryResponse(
    Long tmdbId,
    String mediaType,
    String title,
    String posterPath,
    LocalDateTime viewedAt
) {}
