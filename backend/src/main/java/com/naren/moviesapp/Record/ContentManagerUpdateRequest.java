package com.naren.moviesapp.Record;

public record ContentManagerUpdateRequest(
    String name,
    String phoneNumber,
    String imageUrl,
    String department,
    String specialization,
    Integer accessLevel,
    Boolean isActive
) {}
