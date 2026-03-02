package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.ContentManagerDTO;

public record ContentManagerAuthResponse(ContentManagerDTO contentManagerDTO,
                                        String token) implements AuthResponse {

    @Override
    public String token() {
        return token;
    }
}
