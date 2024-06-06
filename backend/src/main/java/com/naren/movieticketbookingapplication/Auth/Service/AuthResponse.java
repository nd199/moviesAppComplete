package com.naren.movieticketbookingapplication.Auth.Service;

import com.naren.movieticketbookingapplication.Dto.CustomerDTO;

public record AuthResponse(
        CustomerDTO customerDTO, String token
) {
}
