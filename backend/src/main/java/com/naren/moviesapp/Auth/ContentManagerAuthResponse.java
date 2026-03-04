package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.ContentManagerDTO;
import com.naren.moviesapp.Entity.ContentManager;

public record ContentManagerAuthResponse(ContentManagerDTO contentManagerDTO,
                                         ContentManager contentManager,
                                         String token) implements AuthResponse {

    @Override
    public String token() {
        return token;
    }

    @Override
    public ContentManager getUser() {
        return contentManager;
    }
}
