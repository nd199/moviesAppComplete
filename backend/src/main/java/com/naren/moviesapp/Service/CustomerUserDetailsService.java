package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Repo.CustomerRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomerUserDetailsService implements UserDetailsService {
    private final CustomerRepository customerRepository;

    public CustomerUserDetailsService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("CustomerUserDetailsService: Trying to load user: " + email);

        Customer user = customerRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("CustomerUserDetailsService: User NOT found: " + email);
                    return new UsernameNotFoundException("User not found: " + email);
                });

        System.out.println("CustomerUserDetailsService: User FOUND: " + user.getEmail() + ", enabled: " + user.isEnabled());
        return user;
    }
}
