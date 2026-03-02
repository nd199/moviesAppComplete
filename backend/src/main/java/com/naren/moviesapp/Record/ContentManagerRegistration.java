package com.naren.moviesapp.Record;

public record ContentManagerRegistration(
    String name,
    String email,
    String password,
    String phoneNumber,
    String department,
    String specialization
) {}
