package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
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
                customer.getIsLogged(),
                customer.getIsRegistered(),
                customer.getIsSubscribed(),
                customer.getMovies(),
                customer.getRoles().stream().map(Role::getName).toList(),
                customer.getCreatedAt(),
                customer.getUpdatedAt(),
                customer
        );

        return customerDTO;
    }
}
