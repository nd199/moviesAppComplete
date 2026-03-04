package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Admin;
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
                null, // Don't include movies to avoid lazy loading
                null, // Don't include roles to avoid lazy loading
                customer.getCreatedAt(),
                customer.getUpdatedAt(),
                null // Don't include customer entity to avoid circular reference
        );

        return customerDTO;
    }

    public CustomerDTO applyFromAdmin(Admin admin) {
        return new CustomerDTO(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getPhoneNumber(),
                admin.getImageUrl(),
                admin.getIsEmailVerified(),
                admin.getAddress(),
                admin.getIsRegistered(),
                null,
                null,
                null, // Don't include roles to avoid lazy loading
                admin.getCreatedAt(),
                admin.getUpdatedAt(),
                null
        );
    }
}
