package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.AdminDTO;
import com.naren.moviesapp.Entity.Admin;

public record AdminAuthResponse(AdminDTO adminDTO,
                                Admin admin,
                                String token) implements AuthResponse {

    @Override
    public String token() {
        return token;
    }

    @Override
    public Admin getUser() {
        return admin;
    }
}
