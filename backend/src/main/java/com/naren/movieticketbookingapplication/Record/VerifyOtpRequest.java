package com.naren.movieticketbookingapplication.Record;

public record VerifyOtpRequest(
        String customerEmail,
        String enteredOTP
) {
}