package com.naren.moviesapp.Record;

public record PasswordResetRequest(
        String token,
        String newPassword
) {
}
