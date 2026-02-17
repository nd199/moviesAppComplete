package com.naren.moviesapp.Config;

import com.naren.moviesapp.Dao.CustomerDao;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Enum.RoleName;
import com.naren.moviesapp.Repo.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("!test")
@RequiredArgsConstructor
public class SuperAdminSeeder {

    private final CustomerDao customerDao;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.superadmin.email}")
    private String superAdminEmail;

    @Value("${app.superadmin.password}")
    private String superAdminPassword;

    public CommandLineRunner seedSuperAdmin() {
        return args -> {

            // Get the ROLE_SUPER_ADMIN that should already be created by MoviesApplication
            Role superRole = roleRepository.findByName(RoleName.ROLE_SUPER_ADMIN)
                    .orElseThrow(() -> new RuntimeException("ROLE_SUPER_ADMIN not found. Make sure MoviesApplication.createRole() runs first."));

            Customer existingSuperAdmin = customerDao.getCustomerByUsername(superAdminEmail).orElse(null);

            if (existingSuperAdmin == null) {
                Customer superAdmin = new Customer();
                superAdmin.setName("Super Admin");
                superAdmin.setEmail(superAdminEmail);
                superAdmin.setPassword(passwordEncoder.encode(superAdminPassword));
                superAdmin.setIsEmailVerified(true);
                superAdmin.setIsRegistered(true);
                superAdmin.setIsLogged(false);
                superAdmin.getRoles().add(superRole);
                customerDao.addCustomer(superAdmin);
                System.out.println("✅ Super Admin Created Successfully: " + superAdminEmail);
            } else {
                boolean hasSuperRole = existingSuperAdmin.getRoles().stream()
                        .anyMatch(role -> role.getName() == RoleName.ROLE_SUPER_ADMIN);

                if (!hasSuperRole) {
                    existingSuperAdmin.getRoles().add(superRole);
                    customerDao.addCustomer(existingSuperAdmin);
                    System.out.println("✅ Super Admin Role Added Successfully: " + superAdminEmail);
                } else {
                    System.out.println("✅ Super Admin already exists with proper role: " + superAdminEmail);
                }
            }
        };
    }
}
