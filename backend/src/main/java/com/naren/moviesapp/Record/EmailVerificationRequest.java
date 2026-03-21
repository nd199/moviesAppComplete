package com.naren.moviesapp.Record;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailVerificationRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,
        Boolean checkUserExists
) {
}
