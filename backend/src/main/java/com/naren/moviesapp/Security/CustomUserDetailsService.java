package com.naren.moviesapp.Security;

import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Loading user by email: {}", email);
        
        // First try to find admin - fetch roles eagerly
        return adminRepository.findByEmail(email)
                .map(admin -> {
                    // Force initialize roles before closing session
                    admin.getRoles().size(); 
                    logger.debug("User found in admin repository: {}", email);
                    return (UserDetails) new AppUserPrincipal(admin);
                })
                .orElseGet(() -> customerRepository.findByEmail(email)
                        .map(customer -> {
                            // Force initialize roles before closing session
                            customer.getRoles().size();
                            logger.debug("User found in customer repository: {}", email);
                            return (UserDetails) new AppUserPrincipal(customer);
                        })
                        .orElseThrow(() -> {
                            logger.warn("User not found with email: {}", email);
                            return new UsernameNotFoundException("User not found with email: " + email);
                        }));
    }
}
