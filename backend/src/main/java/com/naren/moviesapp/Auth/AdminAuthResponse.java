package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.AdminDTO;

public record AdminAuthResponse(AdminDTO adminDTO,
                                String token) implements AuthResponse {

    @Override
    public String token() {
        return token;
    }
}
