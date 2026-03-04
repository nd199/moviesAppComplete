package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Entity.Customer;

public record CustomerAuthResponse(CustomerDTO customerDTO,
                                   Customer customer,
                                   String token) implements AuthResponse {

    @Override
    public String token() {
        return token;
    }

    @Override
    public Customer getUser() {
        return customer;
    }
}