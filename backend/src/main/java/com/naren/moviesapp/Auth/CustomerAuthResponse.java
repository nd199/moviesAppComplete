package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.CustomerDTO;

public record CustomerAuthResponse(CustomerDTO customerDTO,
                                   String token) implements AuthResponse {

    @Override
    public String token() {
        return token;
    }
}