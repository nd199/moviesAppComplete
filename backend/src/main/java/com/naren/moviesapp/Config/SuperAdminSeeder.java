package com.naren.moviesapp.Config;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void seedSuperAdmin() {
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
            superAdmin.setIsSubscribed(false);
            superAdmin.addRole(superRole);
            customerRepository.save(superAdmin);
        } else {
            boolean hasSuperRole = existingSuperAdmin.getRoles().stream()
                    .anyMatch(role -> role.getName() == RoleName.ROLE_SUPER_ADMIN);

            if (!hasSuperRole) {
                existingSuperAdmin.addRole(superRole);
                customerRepository.save(existingSuperAdmin);
            }
        }
    }
}
