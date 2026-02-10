package com.naren.moviesapp.Record;

public record VerifyOtpRequest(
        String customerEmail,
        String enteredOTP
) {
}