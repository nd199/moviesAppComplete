package com.naren.movieticketbookingapplication.Record;

public record PasswordResetRequest(
        String token,
        String newPassword
) {
}
