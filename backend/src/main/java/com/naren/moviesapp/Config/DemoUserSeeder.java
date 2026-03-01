package com.naren.moviesapp.Config;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Configuration
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class DemoUserSeeder {

    private static final Random RANDOM = new Random();

    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.demo.email}")
    private String demoEmail;

    @Value("${app.demo.password}")
    private String demoPassword;

    @Transactional
    public void seedDemoUser() {
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found. Make sure MoviesApplication.createRole() runs first."));

        Customer existingDemoUser = customerRepository.findByEmail(demoEmail).orElse(null);

        if (existingDemoUser == null) {
            String phoneNumber = "9999999" + String.format("%03d", RANDOM.nextInt(1000));

            while (isPhoneNumberTaken(phoneNumber)) {
                phoneNumber = "9999999" + String.format("%03d", RANDOM.nextInt(1000));
            }

            Customer demoUser = new Customer();
            demoUser.setName("Demo User");
            demoUser.setEmail(demoEmail);
            demoUser.setPassword(passwordEncoder.encode(demoPassword));
            demoUser.setPhoneNumber(phoneNumber);
            demoUser.setAddress("123 Demo Street");
            demoUser.setIsEmailVerified(true);
            demoUser.setIsRegistered(true);
            demoUser.setIsSubscribed(true);
            demoUser.setIsActive(true);
            demoUser.addRole(userRole);

            customerRepository.save(demoUser);
            log.info("Created demo user: {} with phone: {}", demoEmail, phoneNumber);
        } else {
            existingDemoUser.setIsEmailVerified(true);
            existingDemoUser.setIsRegistered(true);
            existingDemoUser.setIsSubscribed(true);
            existingDemoUser.setIsActive(true);
            existingDemoUser.setPassword(passwordEncoder.encode(demoPassword));

            boolean hasUserRole = existingDemoUser.getRoles().stream()
                    .anyMatch(role -> role.getName() == RoleName.ROLE_USER);

            if (!hasUserRole) {
                existingDemoUser.addRole(userRole);
            }

            customerRepository.save(existingDemoUser);
            log.info("Updated demo user: {} with new password and verified email/active status", demoEmail);
        }
    }

    private boolean isPhoneNumberTaken(String phoneNumber) {
        return customerRepository.findAll().stream()
                .anyMatch(c -> c.getPhoneNumber() != null && c.getPhoneNumber().equals(phoneNumber));
    }
}
