package com.naren.moviesapp.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRequest(
        @NotBlank(message = "Username is required")
        @Email(message = "Invalid email format")
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 1, message = "Password is required")
        String password
) {
}
