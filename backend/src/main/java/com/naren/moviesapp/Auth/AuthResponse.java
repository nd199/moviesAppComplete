package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.CustomerDTO;

public record AuthResponse(CustomerDTO customerDTO,
                           String token) {
}
