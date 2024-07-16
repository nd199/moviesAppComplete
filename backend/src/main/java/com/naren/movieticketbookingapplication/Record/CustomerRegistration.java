package com.naren.movieticketbookingapplication.Record;


public record CustomerRegistration(
        String name,
        String email,
        String password,
        Long phoneNumber,
        String imageUrl, boolean isEmailVerified,
        String address,
        boolean isLogged, boolean isRegistered) {
}

