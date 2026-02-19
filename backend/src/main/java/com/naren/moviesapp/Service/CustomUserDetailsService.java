package com.naren.moviesapp.Service;

import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Security.AppUserPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(CustomerRepository customerRepository, AdminRepository adminRepository) {
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return adminRepository
                .findByEmail(email)
                .map(AppUserPrincipal::new)
                .orElseGet(() -> customerRepository.findByEmail(email)
                        .map(AppUserPrincipal::new)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email))
                );
    }
}
