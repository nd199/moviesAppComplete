package com.naren.moviesapp;

import com.naren.moviesapp.Config.SuperAdminSeeder;
import com.naren.moviesapp.Config.DemoUserSeeder;
import com.naren.moviesapp.Entity.*;
import com.naren.moviesapp.Repo.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing
public class MoviesApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoviesApplication.class, args);
    }

    @Bean
    @ConditionalOnProperty(name = "app.data-initialization.enabled", havingValue = "true", matchIfMissing = false)
    @Profile("!test")
    public CommandLineRunner commandLineRunner(RoleRepository roleRepository,
                                               SubscriptionPlanRepository subscriptionPlanRepository,
                                               SuperAdminSeeder superAdminSeeder,
                                               DemoUserSeeder demoUserSeeder) {
        return args -> {
            createDefaultPlans(subscriptionPlanRepository);
            createRole(roleRepository);
            superAdminSeeder.seedSuperAdmin();
            demoUserSeeder.seedDemoUser();
        };
    }
    
    private void createDefaultPlans(SubscriptionPlanRepository planRepository) {
        if (!planRepository.existsByPlanName("Monthly")) {
            planRepository.save(SubscriptionPlan.builder()
                    .planName("Monthly")
                    .description("Access to all content for a month")
                    .price(149.00)
                    .interval("Month")
                    .build());
        }
        if (!planRepository.existsByPlanName("6 Months")) {
            planRepository.save(SubscriptionPlan.builder()
                    .planName("6 Months")
                    .description("Access to all content for 6 months")
                    .price(749.00)
                    .interval("6 Months")
                    .build());
        }
        if (!planRepository.existsByPlanName("Yearly")) {
            planRepository.save(SubscriptionPlan.builder()
                    .planName("Yearly")
                    .description("Access to all content for a year")
                    .price(1499.00)
                    .interval("Year")
                    .build());
        }
    }

    private void createRole(RoleRepository roleRepository) {
        RoleName[] roles = {
            RoleName.ROLE_USER,
            RoleName.ROLE_ADMIN,
            RoleName.ROLE_SUPER_ADMIN,
            RoleName.ROLE_CONTENT_MANAGER,
            RoleName.ROLE_SUPPORT
        };
        for (RoleName roleName : roles) {
            if (!roleRepository.existsByName(roleName)) {
                roleRepository.save(new Role(roleName));
            }
        }
    }

}
