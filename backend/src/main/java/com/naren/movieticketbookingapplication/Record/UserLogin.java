package com.naren.movieticketbookingapplication.Record;


public record UserLogin(
        String email,
        String password,
        Long phoneNumber
) {
}
