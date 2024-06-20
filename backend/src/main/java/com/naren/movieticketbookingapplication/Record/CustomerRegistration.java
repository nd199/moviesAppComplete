package com.naren.movieticketbookingapplication.Record;


public record CustomerRegistration(
        String name,
        String email,
        String password,
        Long phoneNumber,
        boolean isEmailVerified,
        String address,
        boolean isLogged) {
}

