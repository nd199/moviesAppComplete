package com.naren.movieticketbookingapplication.Auth;

import com.naren.movieticketbookingapplication.Dto.CustomerDTO;

public record AuthResponse (CustomerDTO customerDTO,
                            String token){
}
