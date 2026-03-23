package com.naren.moviesapp.Record;

public record AddToWatchlistRequest(
    Long tmdbId,
    String title,
    String posterPath,
    String mediaType
) {}
