package com.naren.movieticketbookingapplication.Dto;

import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Role;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CustomerDTOMapper implements Function<Customer, CustomerDTO> {

    @Override
    public CustomerDTO apply(Customer customer) {
        log.debug("Mapping Customer to CustomerDTO: {}", customer);

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
                customer.getUpdatedAt()
        );

        log.debug("Mapped Customer to CustomerDTO: {}", customerDTO);
        return customerDTO;
    }
}
