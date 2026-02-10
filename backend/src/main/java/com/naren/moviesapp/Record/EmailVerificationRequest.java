package com.naren.moviesapp.Record;

import jakarta.validation.constraints.*;

public record EmailVerificationRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email
) {
}
