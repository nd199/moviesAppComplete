package com.naren.moviesapp.Exception.ApiError;

import java.time.LocalDateTime;

public record ApiError(
        String path,
        String message,
        int statusCode,
        LocalDateTime localDateTime,
        String errorCode
) {
    public ApiError(String path, String message, int statusCode, LocalDateTime localDateTime) {
        this(path, message, statusCode, localDateTime, null);
    }
}
