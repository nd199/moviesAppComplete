package com.naren.moviesapp.Record;

import jakarta.validation.constraints.Pattern;

public record AdminUpdateRequest(
        String name,

        @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
        String phoneNumber,

        String address,

        String department,

        Integer accessLevel,

        Boolean isActive,

        String imageUrl
) {
}
