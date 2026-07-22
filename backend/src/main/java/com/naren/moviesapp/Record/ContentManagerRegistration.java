package com.naren.moviesapp.Record;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContentManagerRegistration(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password,
        @NotBlank String phoneNumber,
        @NotBlank String department,
        @NotBlank String specialization
) {
}
