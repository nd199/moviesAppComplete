package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Admin;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Repo.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public class CustomerDTOMapper implements Function<Customer, CustomerDTO> {

    private final CustomerRepository customerRepository;

    public CustomerDTOMapper(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerDTO apply(Customer customer) {
        // Fetch roles with JOIN FETCH to avoid lazy loading
        Customer customerWithRoles = customerRepository.findByEmailWithRoles(customer.getEmail())
                .orElse(customer); // Fallback to original customer if query fails

        List<String> roleNames = customerWithRoles.getRoles().stream()
                .map(role -> role.getName().name())
                .toList();

        return new CustomerDTO(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getImageUrl(),
                customer.getIsEmailVerified(),
                customer.getAddress(),
                customer.getIsRegistered(),
                customer.getIsSubscribed(),
                roleNames, // Properly loaded roles
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }

    public CustomerDTO applyFromAdmin(Admin admin) {
        List<String> roleNames = admin.getRoles().stream()
                .map(role -> role.getName().name())
                .toList();

        return new CustomerDTO(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getPhoneNumber(),
                admin.getImageUrl(),
                admin.getIsEmailVerified(),
                admin.getAddress(),
                admin.getIsRegistered(),
                null, // Admin doesn't have subscription
                roleNames, // Admin roles
                admin.getCreatedAt(),
                admin.getUpdatedAt()
        );
    }
}
