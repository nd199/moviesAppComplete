package com.naren.movieticketbookingapplication.Record;

public record CustomerUpdateRequest(
        String name,
        String email,
        Long phoneNumber,
        Boolean isEmailVerified,
        Boolean isPhoneVerified,

        Boolean isLogged) {
}

