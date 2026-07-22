package com.naren.moviesapp.Record;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContentManagerLogin(
        @NotBlank @Email String email,
        @NotBlank String password
) {
}
