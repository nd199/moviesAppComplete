package com.naren.moviesapp.Record;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserLogin(
        @NotBlank @Email String email,
        @NotBlank String password,
        String phoneNumber
) {
}
