package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Customer;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class CustomerDTOMapper implements Function<Customer, CustomerDTO> {
    @Override
    public CustomerDTO apply(Customer customer) {

        CustomerDTO customerDTO = new CustomerDTO(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getImageUrl(),
                customer.getIsEmailVerified(),
                customer.getAddress(),
                customer.getIsRegistered(),
                customer.getIsSubscribed(),
                customer.getMovies(),
                customer.getRoles().stream().map(role -> role.getName().name()).toList(),
                customer.getCreatedAt(),
                customer.getUpdatedAt(),
                customer
        );

        return customerDTO;
    }
}
