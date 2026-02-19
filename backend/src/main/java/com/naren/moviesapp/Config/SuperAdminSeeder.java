package com.naren.moviesapp.Config;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("!test")
@RequiredArgsConstructor
public class SuperAdminSeeder {

    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.superadmin.email}")
    private String superAdminEmail;

    @Value("${app.superadmin.password}")
    private String superAdminPassword;

    @Bean
    public CommandLineRunner seedSuperAdmin() {
        return args -> {

            Role superRole = roleRepository.findByName(RoleName.ROLE_SUPER_ADMIN)
                    .orElseThrow(() -> new RuntimeException("ROLE_SUPER_ADMIN not found. Make sure MoviesApplication.createRole() runs first."));

            Customer existingSuperAdmin = customerRepository.findByEmail(superAdminEmail).orElse(null);

            if (existingSuperAdmin == null) {
                Customer superAdmin = new Customer();
                superAdmin.setName("Super Admin");
                superAdmin.setEmail(superAdminEmail);
                superAdmin.setPassword(passwordEncoder.encode(superAdminPassword));
                superAdmin.setPhoneNumber("0000000000");
                superAdmin.setAddress("System Default");
                superAdmin.setIsEmailVerified(true);
                superAdmin.setIsRegistered(true);
                superAdmin.setIsLogged(false);
                superAdmin.setIsSubscribed(false);
                superAdmin.getRoles().add(superRole);
                customerRepository.save(superAdmin);
            } else {
                boolean hasSuperRole = existingSuperAdmin.getRoles().stream()
                        .anyMatch(role -> role.getName() == RoleName.ROLE_SUPER_ADMIN);

                if (!hasSuperRole) {
                    existingSuperAdmin.getRoles().add(superRole);
                    customerRepository.save(existingSuperAdmin);
                }
            }
        };
    }
}
