package com.naren.moviesapp.Record;

public record VerifyOtpRequest(
        String customerEmail,
        String enteredOTP,
        // Backward compatibility - old field names
        String email,
        String otp
) {
}