package com.naren.movieticketbookingapplication.Record;

public record CustomerUpdateRequest(
        String name,
        String email,
        Long phoneNumber,
        String imageUrl, Boolean isEmailVerified,
        String address,
        Boolean isLogged, Boolean isRegistered) {
}

