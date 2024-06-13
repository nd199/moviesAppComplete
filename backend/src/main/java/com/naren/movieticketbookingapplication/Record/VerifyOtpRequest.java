package com.naren.movieticketbookingapplication.Record;

public record VerifyOtpRequest(
        String email,
        String enteredOTP
) {

}