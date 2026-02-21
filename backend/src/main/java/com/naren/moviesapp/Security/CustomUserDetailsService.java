package com.naren.moviesapp.Security;

import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // First try to find admin - fetch roles eagerly
        return adminRepository.findByEmail(email)
                .map(admin -> {
                    // Force initialize roles before closing session
                    admin.getRoles().size(); 
                    return (UserDetails) new AppUserPrincipal(admin);
                })
                .orElseGet(() -> customerRepository.findByEmail(email)
                        .map(customer -> {
                            // Force initialize roles before closing session
                            customer.getRoles().size();
                            return (UserDetails) new AppUserPrincipal(customer);
                        })
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email)));
    }
}
